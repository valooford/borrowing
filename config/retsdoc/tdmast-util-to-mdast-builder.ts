import type { TestObject } from './tdmast-util-find.ts'
import type { Handle, PartialState, State } from './tdmast-util-to-mdast.ts'
import type { Data, Node, Nodes } from './tdmast.ts'
import type { Node as MdastNode, RootContent as MdastRootContent } from 'mdast'

import { ApiItem } from '@microsoft/api-extractor-model'
import { DocNode } from '@microsoft/tsdoc'

import { find } from './tdmast-util-find.ts'

type OrArray<T> = T extends infer TT ? TT | TT[] : never

const isData = (content: unknown): content is Data => content instanceof ApiItem || content instanceof DocNode
const isTdmastNode = (node: MdastNode | Node | undefined): node is Node => isData(node?.data)
const isTdmastArray = (array: (MdastNode | Node)[]): array is Node[] => isTdmastNode(array.at(0))
const isCondition = (content: unknown): content is TestObject => {
  if (Array.isArray(content)) return false
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if ((content as Nodes).children) return false
  return true
}
const toArr = <T>(v: T) => (Array.isArray(v) ? v : [v]) as T extends any[] ? T : T[]

interface Options {
  allowDuplicates: boolean
}

class Builder {
  options: Readonly<Options>
  content: MdastRootContent[] = []
  #cache = new Set<Node>()
  constructor(options?: Partial<Options>) {
    this.options = {
      allowDuplicates: options?.allowDuplicates ?? false,
    }
  }

  add(
    content: OrArray<Node>,
    partialState: PartialState | undefined,
    state: State<any>, // TODO: fix `state` that is a required parameter
  ): void
  add<T extends Nodes>(content: TestObject, node: T, state: State<T['type']>): void
  add(content: OrArray<MdastNode>): void
  add(
    content: OrArray<MdastNode | Node> | TestObject | Builder,
    nodeOrPartialState?: Nodes | PartialState,
    state?: State,
  ) {
    if (content instanceof Builder) {
      this.add(content.content)
      return
    }
    if (isCondition(content)) {
      const node = nodeOrPartialState as Nodes | undefined
      if (!node || !state) return
      const n = find(node, content)
      if (!n) return
      let nArr = toArr(n)
      if (!this.options.allowDuplicates) {
        nArr = nArr.filter((n) => !this.#cache.has(n)) as typeof nArr
        nArr.forEach((n) => this.#cache.add(n))
      }
      this.content.push(...nArr.flatMap((ch) => (state.handlers[ch.type] as Handle)(ch) as MdastRootContent[]))

      return
    }
    const nArr = toArr(content) as (MdastNode | Node)[]
    if (!nArr.length) return
    if (isTdmastArray(nArr)) {
      const partialState = nodeOrPartialState as PartialState | undefined
      if (!state) return
      let filteredTdmastNodes = nArr
      if (!this.options.allowDuplicates) {
        filteredTdmastNodes = filteredTdmastNodes.filter((n) => !this.#cache.has(n))
        filteredTdmastNodes.forEach((n) => this.#cache.add(n))
      }
      this.content.push(
        ...filteredTdmastNodes.flatMap(
          (n) => (state.handlers[n.type] as Handle)(n, partialState) as MdastRootContent[],
        ),
      )
    } else {
      this.content.push(...(nArr as MdastRootContent[]))
    }
  }

  clear() {
    this.content = []
    this.#cache.clear()
  }
}

export { Builder }
export type { Options }
