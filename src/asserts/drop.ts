import type * as OwnershipTypes from '@ownership/types'

import { isOwnership } from '@ownership/utils/isOwnership'

/**
 * @summary
 *
 * Garbages a captured value. \
 * Allows the assertion function to return a payload.
 *
 * @example
 *
 * ```ts
 * enum Result { Ok, Err }
 * function _assert<T extends Ownership.GenericBounds<any, Result>>(
 *   ownership: Ownership.ParamsBounds<T> | undefined,
 * ): asserts ownership is Ownership.LeaveAssertion<T> {
 *   borrow(ownership)
 *   drop(ownership, Result.Ok)
 * }
 * ```
 *
 * @description
 *
 * Is a shorthand form of the `release` function, which sets the captured value to `undefined`.
 *
 * ```ts
 * release(ownership, undefined, Result.Ok)
 * // same as
 * drop(ownership, Result.Ok)
 * ```
 *
 * The `drop` function narrows the passed `Ownership` to `never` in the body of the assertion function itself. \
 * Can be used inside an assertion function that
 * invalidates the `Ownership` parameter by narrowing it to `undefined`.
 *
 * ```ts
 * function _assert<T extends Ownership.GenericBounds<number>>(
 *   ownership: Ownership.ParamsBounds<T> | undefined,
 * ): asserts ownership is undefined {
 *   borrow(ownership)
 *   _assert(ownership)
 *   ownership // type `never`
 * }
 * ```
 *
 * @throws
 *
 * When `throwOnWrongState` setting is enabled (`true` by default), throws an 'Unable to drop ...' error \
 * if the `give` and `borrow` functions were not called in sequence beforehand.
 *
 * This is due to internal tracking of the ownership/borrowing status.
 *
 * ```ts
 * const ownership = new Ownership<number>().capture(123 as const).give()
 * _assert(ownership) // throws
 *
 * function _assert<T extends Ownership.GenericBounds>(
 *   ownership: Ownership.ParamsBounds<T> | undefined,
 * ): asserts ownership is Ownership.LeaveAssertion<T> {
 *   // (...)
 *   drop(ownership) // Error: Unable to drop (not borrowed), call `borrow` first
 * }
 * ```
 *
 * @see https://github.com/valooford/borrowing/blob/main/README.md#drop
 */
export function drop<T extends OwnershipTypes._GenericBounds>(
  ownership: OwnershipTypes.ParamsBounds<T>,
  payload?: T['ReleasePayload'],
): asserts ownership is undefined {
  isOwnership<T>(ownership)
  if (ownership.state !== 'borrowed' && ownership.options.throwOnWrongState) {
    switch (ownership.state) {
      case 'given':
        throw Error('Unable to drop (not borrowed), call `borrow` first')
      case 'settled':
        throw Error('Unable to drop (already settled), call `give` first')
    }
  }
  ownership.released = undefined
  ownership.captured = undefined
  if (arguments.length == 2) ownership.releasePayload = payload
  ownership.state = 'settled'
}
