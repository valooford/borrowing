import type { RefCell } from './cell'

enum Clone {}
enum Copy {}
enum Drop {}

interface CopyableStruct<T = any> {
  copy(): CopyableStruct<T>
}
interface ClonableStruct<T = any> {
  clone(): ClonableStruct<T>
}
interface Clonable<T, C extends T, _Traits> {
  clone(this: RefCell<T, C>): RefCell<T, C>
}
interface Droppable {
  /** @internal */
  drop(): void
}

type TraitStructByKindMap<T, C extends T, _Traits> =
  | [Clone, Clonable<T, C, _Traits>, ClonableStruct]
  | [Copy, Clonable<T, C, _Traits>, CopyableStruct | ClonableStruct]
  | [Drop, Droppable, Droppable]
type TraitStructByKind<Kind, Pair> = Pair extends [infer K, infer Struct, any]
  ? Kind extends K
    ? Struct
    : never
  : never
type Traits<
  T,
  C extends T,
  List,
  All extends List = List,
> = List extends infer Kind
  ? TraitStructByKindMap<T, C, All> extends infer Pair
    ? TraitStructByKind<Kind, Pair>
    : never
  : never

type TraitKindByStruct<Struct, Pair> = Pair extends [infer Kind, any, infer S]
  ? Struct extends S
    ? Kind
    : never
  : never
type DerivedTraits<T> = T extends object
  ? T extends infer Struct
    ? TraitStructByKindMap<any, any, T> extends infer Pair
      ? TraitKindByStruct<Struct, Pair>
      : never
    : never
  : Copy

export type {
  Traits,
  DerivedTraits,
  ClonableStruct,
  CopyableStruct,
  Droppable as DroppableStruct,
  Clonable,
  Droppable,
}
