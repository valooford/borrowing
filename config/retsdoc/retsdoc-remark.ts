import type { Root } from './tdmast'
import type { Root as MdastRoot } from 'mdast'
import type { VFile } from 'vfile'

import { toMdast } from './tdmast-util-to-mdast.ts'

export const retsdocRemark = function (
  options?: Parameters<typeof toMdast>[1],
) {
  return (tree: Root, _file: VFile): MdastRoot => {
    // TODO: add options to allow overriding handlers (i.e. adding "Scroll Up" links at the end of each section)
    return toMdast(tree, options)
  }
}
