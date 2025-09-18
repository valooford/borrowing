import type { Nodes } from './tdmast'

import { parents as unistParents } from 'unist-util-parents'

interface Proxy<T extends Nodes> {
  parent: Proxied | undefined
  node: T
}
type Proxied<T extends Nodes = Nodes> = T & Proxy<T>

const parents = <T extends Nodes>(tree: T) => unistParents(tree) as Proxied<T>

export { parents }
export type { Proxied }
