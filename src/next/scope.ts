import type { RefCell, RefCellMut } from './cell'

import { AnyRefCellMut, RefCellBase } from './cell'

declare const __mut: unique symbol
type Mut<T = any> = T & { [__mut]: T }
/** @public */
const mut = <T>(v: T) => v as Mut<T>
type NoMut<T> = T extends Mut<infer TT> ? TT : T

type CheckMut<T, C extends T> =
  C extends Mut<NoMut<T>>
    ? RefCellMut<NoMut<T>, NoMut<T>>
    : RefCell<Readonly<T>, Readonly<C>>
type CaptureFn<T> = <C extends T>(value: C) => CheckMut<T, C>

/** @public */
class Scope {
  private cells: RefCellBase[] = []
  of<T>(): CaptureFn<T> {
    return this.capture.bind(this)
  }
  private capture<T, C extends T>(value: C) {
    const cell = new AnyRefCellMut<T, C>(value, this) as unknown as CheckMut<
      T,
      C
    >
    this.cells.push(cell)
    return cell
  }
  string<T extends string>(value: T): CheckMut<string, T> {
    return this.of<string>()(value)
  }
  number<T extends number>(value: T): CheckMut<number, T> {
    return this.of<number>()(value)
  }
  boolean<T extends boolean>(value: T): CheckMut<boolean, T> {
    return this.of<boolean>()(value)
  }
  null(): CheckMut<null, null> {
    return this.of<null>()(null)
  }
  array<T, A extends T[] = T[]>(value: A): CheckMut<A, A> {
    return this.of<A>()(value)
  }
  map<K, V>(): RefCellBase<Map<K, V>> {
    return this.of<Map<K, V>>()(new Map<K, V>())
  }
  set<T>(): RefCellBase<Set<T>> {
    return this.of<Set<T>>()(new Set<T>())
  }

  /** @internal */
  move(cell: RefCellBase, to?: Scope): void {
    if (to) {
      this.cells = this.cells.filter((c) => c !== cell)
      to.move(cell)
    } else {
      this.cells.push(cell)
    }
  }
  /** @internal */
  over(): void {
    // this.cells.forEach((c) => c.drop())
    this.cells.length = 0
  }
}

type ToScope<T extends RefCellBase[]> = T // TODO: change layer

/** @public */
type ScopeBlock<T = unknown> = T extends RefCellBase[]
  ? (scope: Scope, ...moved: ToScope<T>) => void
  : (scope: Scope) => void

/** @public */
const scope = <Move extends RefCellBase[]>(
  ...args: [...Move, ScopeBlock<Move>]
): void => {
  const move = args.slice(0, -1) as Move
  const block = args.at(-1) as ScopeBlock<Move>

  const scope = new Scope()
  const moved = move.map((cell) => cell.move(scope))

  block(scope, ...moved)
  scope.over()
}

export { scope, mut }
export type { Scope, CaptureFn, CheckMut, ScopeBlock }
