import type { RefCell, RefCellMut } from './cell'

type Ref<T = unknown, C extends T = T> = RefCell<T, C> & { deref(): C }

type RefMut<T = unknown, C extends T = T> = RefCellMut<T, C> & { deref(): C }

type Borrow<T = unknown, C extends T = T> = Ref<T, C> & {
  take(): RefCell<T, C>
}

type BorrowMut<T = unknown, C extends T = T> = RefMut<T, C> & {
  take(): RefCellMut<T, C>
}

function borrow<T, C extends T = T>(
  cell: RefCell<T, C>,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
): asserts cell is Borrow<T, C> {}
function borrowMut<T>(
  cell: RefCellMut<T, T>,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
): asserts cell is BorrowMut<T, T> {}

export { borrow, borrowMut }
export type { Ref, RefMut, Borrow, BorrowMut }
