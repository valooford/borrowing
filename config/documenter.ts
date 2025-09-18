import type { Heading, Root as MdastRoot, RootContent } from 'mdast'

import fs from 'node:fs/promises'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { read } from 'to-vfile'
import { unified } from 'unified'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'

import { retsdocRemark } from './retsdoc/retsdoc-remark.ts'
import retsdoc from './retsdoc/retsdoc.ts'

const docModel = await read('temp/borrowing.api.json')
const apiPackageTree = retsdoc().parse(docModel)
const apiReference = await retsdoc().use(retsdocRemark, { headingDepth: 3 }).run(apiPackageTree)

const readme = await fs.readFile('README.md', 'utf8')
const readmeFin = await unified()
  .use(remarkParse)
  .use(remarkReplaceHeadingContent, { text: 'API Reference', depth: 2 }, ...apiReference.children)
  // TODO: Update TOC (table of contents)
  .use(remarkStringify)
  .process(readme)
await fs.writeFile('README.md', readmeFin.toString())

console.log('Done')

/* -------- */

/** @see {@link https://github.com/unicorn-utterances/unist-util-replace-all-between} */

function remarkReplaceHeadingContent(options: { text: string; depth?: Heading['depth'] }, ...content: RootContent[]) {
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
        if (typeof nextHeadingIndex !== 'number' && node.depth < depth + 1 && typeof index === 'number') {
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
