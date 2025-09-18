import type { ApiData, ApiDocumentedData, Data, DocData, Nodes, NodeType, Root } from './tdmast'

import { DocNode } from '@microsoft/tsdoc'

/** @see {@link https://github.com/syntax-tree/mdast-util-from-markdown} */

/** */
const hasComment = (node: ApiData): node is ApiDocumentedData => {
  return !!(node as ApiDocumentedData).tsdocComment
}
type PreferRoot<T> = T extends Root ? Root : T

const fromDocModel = <Value extends Data>(value: Value): PreferRoot<Extract<Nodes, { data: Value }>> => {
  if (value instanceof DocNode) {
    return {
      type: value.kind as NodeType,
      data: value,
      children: value.getChildNodes().map((m) => fromDocModel(m as DocData)),
    } as ReturnType<typeof fromDocModel<Value>>
  }
  const children: Nodes[] = value.members.map((m) => fromDocModel(m))
  if (hasComment(value) && value.tsdocComment) {
    children.push(fromDocModel(value.tsdocComment))
  }
  return {
    type: value.kind as NodeType,
    data: value,
    children,
  } as ReturnType<typeof fromDocModel<Value>>
}

export { fromDocModel }
