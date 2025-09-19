import type { Heading, Root as MdastRoot, RootContent } from 'mdast'

import fs from 'node:fs/promises'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { read } from 'to-vfile'
import { unified } from 'unified'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'

import { loadPackage } from '../retsdoc/retsdoc-parse.ts'
import { retsdocRemark } from '../retsdoc/retsdoc-remark.ts'
import retsdoc from '../retsdoc/retsdoc.ts'
import { find } from '../retsdoc/tdmast-util-find.ts'
import { ContentKind } from '../retsdoc/tdmast.ts'

const docModel = await read('temp/borrowing.api.json')
const apiPackageTree = retsdoc().parse(docModel)
const apiReference = await retsdoc()
  .use(loadPackage, { apiJsonFilename: 'temp/borrowing.next.api.json' })
  .use(retsdocRemark, {
    headingBaseDepth: 2,
    handlers: {
      [ContentKind.Api.Package]: (node, state) => {
        if (node.data.displayName !== 'borrowing/next') return []
        const entryPointNodes = find(node, { data: node.data.entryPoints })
        if (entryPointNodes?.length) {
          return entryPointNodes.flatMap((n) => state.handlers[n.type](n))
        }
        return []
      },
    },
  })
  .run(apiPackageTree)

async function updateReadme(filePath: string, headingText: string) {
  let readme
  try {
    readme = await fs.readFile(filePath, 'utf8')
  } catch {
    readme ??= ''
  }
  const readmeFin = await unified()
    .use(remarkParse)
    .use(
      remarkReplaceHeadingContent,
      { text: headingText, depth: 2 },
      ...apiReference.children,
    )
    // TODO: Update TOC (table of contents)
    .use(remarkStringify)
    .process(readme)
  await fs.writeFile(filePath, readmeFin.toString())
}

await Promise.all([
  updateReadme('README.md', 'API Reference'),
  updateReadme('README.ru-RU.md', 'Справочник API'),
])

console.log('Done')

/* -------- */

/** @see {@link https://github.com/unicorn-utterances/unist-util-replace-all-between} */

function remarkReplaceHeadingContent(
  options: { text: string; depth?: Heading['depth'] },
  ...content: RootContent[]
) {
  const { text, depth = 1 } = options
  return (tree: MdastRoot) => {
    let referenceIndex: number | undefined
    let nextHeadingIndex: number | undefined
    visit(tree, 'heading', (node, index, _parent) => {
      if (typeof referenceIndex !== 'number') {
        if (node.depth === depth) {
          visit(node, 'text', (hContent) => {
            if (hContent.value === text) {
              referenceIndex = index
            }
          })
        }
      } else {
        if (
          typeof nextHeadingIndex !== 'number' &&
          node.depth < depth + 1 &&
          typeof index === 'number'
        ) {
          nextHeadingIndex = index
        }
      }
    })
    referenceIndex ??= tree.children.length
    nextHeadingIndex ??= tree.children.length
    const deleteCount = nextHeadingIndex - referenceIndex

    const heading = u('heading', { depth } as const, [u('text', text)])

    tree.children.splice(referenceIndex, deleteCount, heading, ...content)

    return tree
  }
}
