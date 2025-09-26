import type { Borrow } from './refs'
import type { Scope } from './scope'
import type {
  Clonable,
  ClonableStruct,
  CopyableStruct,
  DerivedTraits,
  Droppable,
  DroppableStruct,
  Traits,
} from './trait'
import type { UnionToIntersection } from '@shared/types'

/** @public */
class RefCellBase<T = unknown, C extends T = T> {
  protected value: C
  protected owner: Scope
  constructor(value: C, owner: Scope) {
    this.value = value
    this.owner = owner
  }
  /** @internal */
  move(to: Scope): RefCellBase<string, '123'> {
    this.owner.move(this, to)
    this.owner = to
    return this as RefCellBase<string, '123'>
  }
}

type RefCell<T = any, C extends T = T /* , TraitsList = '' */> = RefCellBase<
  T,
  C
> &
  UnionToIntersection<Traits<T, C, DerivedTraits<C>>>

type AnyConstructor<T> = new (...args: any[]) => T
function WithTraits<
  T,
  C extends T,
  TBase extends AnyConstructor<RefCellBase<T, C>>,
>(base: TBase) {
  return class TraitsMixin
    extends base
    implements Clonable<any, any, any>, Droppable, Borrow<any, any>
  {
    clone() {
      if (
        (typeof this.value === 'object' && this.value) ||
        typeof this.value === 'function'
      ) {
        const clonableValue = this.value as object as ClonableStruct<T>
        if (typeof clonableValue.clone === 'function') {
          const value = clonableValue.clone()
          return new TraitsMixin(value)
        }
        const copyableValue = this.value as object as CopyableStruct<T>
        const value = copyableValue.copy()
        return new TraitsMixin(value)
      }
      // TODO: this.scope.move(instance) or this.scope.of()(value)
      return new TraitsMixin(this.value)
    }
    /** @internal */
    drop() {
      const droppableValue = this.value as object as DroppableStruct
      droppableValue.drop()
    }
    deref() {
      return this.value
    }
    take() {
      return this
    }
  }
}

const AnyRefCell = WithTraits(RefCellBase) as new <T, C extends T>(
  value: C,
  owner: Scope,
) => RefCell<T, C>

class RefCellMutBase<T, C extends T = T> extends RefCellBase<T, C> {
  replace(value: C): C {
    const prev = this.value
    this.value = value
    return prev
  }
}

type RefCellMut<T = any, C extends T = T> = RefCellMutBase<T, C> &
  UnionToIntersection<Traits<T, C, DerivedTraits<C>>>

const AnyRefCellMut = WithTraits(RefCellMutBase) as new <T, C extends T>(
  value: C,
  owner: Scope,
) => RefCellMut<T, C>

export { RefCellBase, RefCellMutBase, AnyRefCell, AnyRefCellMut }
export type { RefCell, RefCellMut }
