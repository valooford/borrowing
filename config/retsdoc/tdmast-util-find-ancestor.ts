import type { Nodes } from './tdmast'
import type { Proxied } from './tdmast-util-parents'

type TestObject = Partial<Omit<Nodes, 'children'>>

function findAncestor<Test extends TestObject>(
  tree: Proxied,
  condition: Test,
): Proxied<Extract<Nodes, Test>> | undefined {
  for (let parent = tree.parent; parent; parent = parent.parent) {
    if (condition.data && parent.data === condition.data) {
      return parent as Proxied<Extract<Nodes, Test>>
    }
    if (condition.type && parent.type === condition.type) {
      return parent as Proxied<Extract<Nodes, Test>>
    }
  }
  return undefined
}

export { findAncestor }
