import type { Nodes, NodeType } from './tdmast'
import type { Proxied } from './tdmast-util-parents'

type TestObjectBase = Partial<Omit<Nodes, 'children'>>

type OrArray<T extends TestObjectBase> =
  | T
  | (Omit<T, 'data'> & { data?: readonly T['data'][] })
  | (Omit<T, 'type' | 'data'> & { type?: [T['type']]; data?: undefined })
type Flat<T extends TestObject> = T['data'] extends readonly any[]
  ? Omit<T, 'data'> & { data?: T['data'][number] }
  : T['type'] extends [NodeType]
    ? { type?: T['type'][0] }
    : T
type OrArrayOf<T extends TestObject, R> = T['data'] extends readonly any[]
  ? R[]
  : T['type'] extends [NodeType]
    ? R[]
    : R
type OrProxied<T extends Nodes, R extends Nodes> = T extends Proxied
  ? Proxied<R>
  : R

type TestObject = OrArray<TestObjectBase>

const isDataArray = <T extends TestObject>(
  condition: T,
): condition is Extract<T, { data: any[] }> => {
  return Array.isArray(condition.data)
}
const isTypeArray = <T extends TestObject>(
  condition: T,
): condition is Extract<T, { type: [NodeType] }> => {
  return Array.isArray(condition.type)
}

/* eslint-disable @typescript-eslint/no-unsafe-return */

function find<T extends Nodes, Test extends TestObject>(
  tree: T,
  condition: Test,
): OrArrayOf<Test, OrProxied<T, Extract<Nodes, Flat<Test>>>> | undefined {
  if (isDataArray(condition)) {
    // TODO: keep order the same
    const match = new Set(condition.data)
    return (tree.children as Nodes[]).filter((n) =>
      match.has(n.data),
    ) as Exclude<ReturnType<typeof find>, Nodes>
  }
  if (isTypeArray(condition)) {
    const [type] = condition.type
    return (tree.children as Nodes[]).filter((n) => n.type === type) as Exclude<
      ReturnType<typeof find>,
      Nodes
    >
  }
  return (tree.children as Nodes[]).find((child) => {
    if (condition.data) return child.data === condition.data
    if (condition.type && child.type !== condition.type) return false
    return true
  }) as Extract<ReturnType<typeof find>, Nodes | undefined>
}

export { find }
export type { TestObject }
