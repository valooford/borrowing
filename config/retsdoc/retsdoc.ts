import { unified } from 'unified'

import retsdocParse from './retsdoc-parse.ts'
import retsdocStringify from './retsdoc-stringify.ts'

/** @see {@link https://github.com/remarkjs/remark/blob/main/packages/remark/index.js} */

/**
 * @example
 *
 * ```ts
 * const test = (await retsdoc().process('package.api.json')).toString()
 * ```
 *
 * \~\~\~
 *
 * ```ts
 * import { read } from 'to-vfile'
 *
 * const docModel = await read('package.api.json')
 * const apiPackageTree = retsdoc().parse(docModel)
 * const apiReference = await retsdoc().use(retsdocRemark).run(apiPackageTree)
 * // ...operate on `apiReference`
 * const res = unified().use(remarkStringify).stringify(apiReference)
 * await fs.writeFile('package.md', res)
 * ```
 */
const retsdoc = () => {
  return unified().use(retsdocParse).use(retsdocStringify) // TODO: possibly call .freeze()
}

export default retsdoc
