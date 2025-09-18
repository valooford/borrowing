import type { Root } from './tdmast'
import type { Plugin } from 'unified'

import { ApiModel } from '@microsoft/api-extractor-model'

import { fromDocModel } from './tdmast-util-from-doc-model.ts'

/** @see {@link https://github.com/remarkjs/remark/blob/main/packages/remark-parse/lib/index.js} */

/** */
const loadAllPackages = (apiModel: ApiModel, apiJsonFilename: string | string[]) => {
  if (Array.isArray(apiJsonFilename)) {
    apiJsonFilename.forEach((filename) => {
      apiModel.loadPackage(filename)
    })
  } else {
    apiModel.loadPackage(apiJsonFilename)
  }
}

type Options = Readonly<{
  apiJsonFilename: string | string[]
}>

const retsdocParse: Plugin<[(Partial<Options> | null)?], string, Root> = function (options) {
  this.parser = function (document: string, file) {
    const apiModel = new ApiModel()
    const apiJsonFilename = file.path || document
    if (apiJsonFilename) {
      apiModel.loadPackage(file.path || document)
    }
    if (options?.apiJsonFilename) loadAllPackages(apiModel, options.apiJsonFilename)

    return fromDocModel(apiModel)
  }
}

const loadPackage = function (options: Options) {
  return (tree: Root): Root => {
    const apiModel = tree.data
    loadAllPackages(apiModel, options.apiJsonFilename)
    return fromDocModel(apiModel)
  }
}

export default retsdocParse
export { loadPackage }
export type { Options }
