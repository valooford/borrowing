import type * as OwnershipTypes from '@ownership/types'

import { isOwnership } from '@ownership/utils/isOwnership'
import { isFunction } from '@shared/utils'

import { release } from './release'
import { take } from './take'

/**
 * @summary
 *
 * Garbages a captured value. \
 * Allows the assertion function to return a payload, and external code to retrieve it.
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
 *
 * const ownership = new Ownership().expectPayload<Result>().give()
 * _assert(ownership)
 * drop(ownership, (payload) => {
 *   payload // Result.Ok
 * })
 * ```
 *
 * @description
 *
 * Can be used both in the body of an assertion function (`LeaveAssertion`)
 * instead of `release`, and in external code instead of `take`. \
 * The selected behavior is determined by the type of the 2nd parameter -
 * extracting the value if it is a callback, and writing the payload for other types.
 *
 * ```ts
 * release(ownership, undefined, Result.Ok)
 * // same as
 * drop(_ownership, Result.Ok)
 *
 * take(_ownership_, (_, _payload) => {})
 * // same as
 * drop(__ownership, (_payload) => {})
 * ```
 *
 * The `drop` function narrows the passed `Ownership` to `never`. \
 * Can be used inside an assertion function that
 * invalidates the `Ownership` parameter by narrowing it to `undefined`.
 *
 * ```ts
 * function _assert<T extends Ownership.GenericBounds<number>>(
 *   ownership: Ownership.ParamsBounds<T> | undefined,
 * ): asserts ownership is undefined {
 *   borrow(ownership)
 *   drop(ownership)
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
 *   ownership: Ownership.ParamsBounds<T> | undefined,
 * ): asserts ownership is Ownership.LeaveAssertion<T> {
 *   // (...)
 *   drop(ownership) // Error: Unable to release (not borrowed), call `borrow` first
 * }
 * ```
 *
 * @see https://github.com/valooford/borrowing#drop
 */
export function drop<T extends OwnershipTypes.AnyOwnership, TMap extends OwnershipTypes._inferTypes<T>>(
  ownership: T | undefined,
  payloadOrReceiver?: TMap['ReleasePayload'] | ((payload: TMap['ReleasePayload']) => void),
): asserts ownership is undefined {
  isOwnership<TMap>(ownership)
  if (isFunction(payloadOrReceiver)) {
    const receiver = payloadOrReceiver
    take(ownership, (_, payload) => {
      receiver(payload)
    })
    return
  }

  if (arguments.length == 2) {
    const payload = payloadOrReceiver
    release(ownership, undefined, payload)
  } else {
    release(ownership)
  }
}
