import type { ConsumerOwnership } from '@ownership/interfaces'
import type * as OwnershipTypes from '@ownership/types'

import { isPubOwnership } from '@ownership/utils/isPubOwnership'

/**
 * @summary
 *
 * Narrows the type of `Ownership` inside the assertion function. \
 * This allows access to the captured value.
 *
 * @example
 *
 * ```ts
 * function _assert<T extends Ownership.GenericBounds<number>>(
 *   ownership: Ownership.ParamsBounds<T> | undefined,
 * ): asserts ownership is Ownership.LeaveAssertion<T> {
 *   borrow(ownership)
 *   const value = ownership.captured // type `number`
 * }
 * ```
 *
 * @description
 *
 * When the `throwOnWrongState` setting is enabled (`true` by default), \
 * a call to the `borrow` function must precede a call to the `release` and `drop` assertion functions.
 *
 * This is due to internal tracking of the ownership/borrowing status.
 *
 * ```ts
 * const ownership = new Ownership<number>().give()
 * _assert(ownership) // throws
 *
 * function _assert<T extends Ownership.GenericBounds<number>>(
 *   ownership: Ownership.ParamsBounds<T> | undefined,
 * ): asserts ownership is Ownership.LeaveAssertion<T> {
 *   release(ownership, value) // Error: Unable to release (not borrowed), call `borrow` first
 * }
 * ```
 *
 * @throws
 *
 * When `throwOnWrongState` setting is enabled (`true` by default), throws an 'Unable to borrow ...' error \
 * if `give` has not been called before.
 *
 * This is due to internal tracking of the ownership/borrowing status.
 *
 * ```ts
 * const ownership = new Ownership<number>()
 * _assert(ownership) // throws
 *
 * function _assert<T extends Ownership.GenericBounds<number>>(
 *   ownership: Ownership.ParamsBounds<T> | undefined,
 * ): asserts ownership is Ownership.LeaveAssertion<T> {
 *   borrow(ownership) // Error: Unable to borrow (not given), call `give` first
 * }
 * ```
 *
 * @see https://github.com/valooford/borrowing#borrow
 */
export function borrow<T extends OwnershipTypes._GenericBounds>(
  ownership: OwnershipTypes.PubParamsBounds<T>,
): asserts ownership is ConsumerOwnership<T['General'], T['General'], any, any, T['ReleasePayload']> {
  isPubOwnership(ownership)
  if (ownership.state !== 'given' && ownership.options.throwOnWrongState) {
    throw Error('Unable to borrow (not given), call `give` first')
  }
  ownership.state = 'borrowed'
}
