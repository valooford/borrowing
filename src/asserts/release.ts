import type * as OwnershipTypes from '@ownership/types'

import { isOwnership } from '@ownership/utils/isOwnership'
import { isFunction } from '@shared/utils'

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
 *   release(ownership, (prev) => prev)
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
 * @see https://github.com/valooford/borrowing/blob/main/README.md#release
 */
export function release<T extends OwnershipTypes._GenericBounds>(
  ownership: OwnershipTypes.ParamsBounds<T>,
  setValue: T['General'] | ((prev: T['General']) => T['General']),
  payload?: T['ReleasePayload'],
): asserts ownership is undefined {
  isOwnership<T>(ownership)
  if (ownership.state !== 'borrowed' && ownership.options.throwOnWrongState) {
    switch (ownership.state) {
      case 'given':
        throw Error('Unable to release (not borrowed), call `borrow` first')
      case 'settled':
        throw Error('Unable to release (already settled), call `give` first')
    }
  }
  ownership.released = isFunction(setValue) ? setValue(ownership.captured) : setValue
  ownership.captured = undefined
  if (arguments.length == 3) ownership.releasePayload = payload
  ownership.state = 'settled'
}
