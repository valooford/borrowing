import type { Root } from './tdmast'
import type { Compiler, Plugin } from 'unified'

/** @see {@link https://github.com/remarkjs/remark/blob/main/packages/remark-stringify/lib/index.js} */

/** */
type Options = Readonly<{
  space?: string | number | undefined
}>

const retsdocStringify: Plugin<[(Options | null)?], Root, string> = function (options) {
  ;(this.compiler as Compiler<Root, string>) = (tree) => {
    const jsonObject = {}
    tree.data.serializeInto(jsonObject)
    return JSON.stringify(jsonObject, null, options?.space)
  }
}

export default retsdocStringify
