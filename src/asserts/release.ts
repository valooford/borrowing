import type * as OwnershipTypes from '@ownership/types'

import { isOwnership } from '@ownership/utils/isOwnership'

/**
 * @summary
 *
 * Morphs a captured value. \
 * Allows the assertion function to return a payload.
 *
 * @example
 *
 * ```ts
 * type Status = 'open' | 'closed'
 * enum Result { Ok, Err }
 * function close<T extends Ownership.GenericBounds<Status, Result>>(
 *   ownership: Ownership.ParamsBounds<T> | undefined,
 * ): asserts ownership is Ownership.MorphAssertion<T, 'closed'> {
 *   borrow(ownership)
 *   release(ownership, 'closed', Result.Ok)
 * }
 * ```
 *
 * @description
 *
 * The `release` function narrows the passed `Ownership` to `never` in the body of the assertion function itself.
 *
 * ```ts
 * function _assert<T extends Ownership.GenericBounds>(
 *   ownership: Ownership.ParamsBounds<T> | undefined,
 * ): asserts ownership is Ownership.MorphAssertion<T, any> {
 *   borrow(ownership)
 *   release(ownership)
 *   ownership // type `never`
 * }
 * ```
 *
 * @throws
 *
 * When `throwOnWrongState` setting is enabled (`true` by default), throws an 'Unable to release ...' error \
 * if the `give` and `borrow` functions were not called in sequence beforehand.
 *
 * This is due to internal tracking of the ownership/borrowing status.
 *
 * ```ts
 * const ownership = new Ownership<number>().capture(123 as const).give()
 * _assert(ownership) // throws
 *
 * function _assert<T extends Ownership.GenericBounds>(
 *  ownership: Ownership.ParamsBounds<T> | undefined,
 *): asserts ownership is Ownership.MorphAssertion<T, any> {
 *   release(ownership, value) // Error: Unable to release (not borrowed), call `borrow` first
 * }
 * ```
 *
 * @see https://github.com/valooford/borrowing#release
 */
export function release<T extends OwnershipTypes.AnyOwnership, TMap extends OwnershipTypes._inferTypes<T>>(
  ownership: T | undefined,
  value?: TMap['General'],
  payload?: TMap['ReleasePayload'],
): asserts ownership is undefined {
  isOwnership<TMap>(ownership)
  if (ownership.state !== 'borrowed') {
    if (!ownership.options.throwOnWrongState) return
    switch (ownership.state) {
      case 'given':
        throw Error('Unable to release (not borrowed), call `borrow` first')
      case 'settled':
        throw Error('Unable to release (already settled), call `give` first')
    }
  }
  if (arguments.length >= 2) ownership.captured = value
  if (arguments.length == 3) ownership.releasePayload = payload
  ownership.state = 'settled'
}
