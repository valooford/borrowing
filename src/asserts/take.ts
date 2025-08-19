import type * as OwnershipTypes from '@ownership/types'

import { isOwnership } from '@ownership/utils/isOwnership'

/**
 * @summary
 *
 * Retrieves the captured value from the passed `Ownership`. \
 * After retrieval, the `Ownership` instance no longer contains a value and is of type `never`.
 *
 * @example
 *
 * ```ts
 * const ownership = new Ownership<number>().capture(123 as const)
 * let _dst: number
 * take(ownership, (value) => (_dst = value))
 * ```
 *
 * @description
 *
 * The `take` function invalidates the `Ownership` parameter by narrowing it to `never`. \
 * For this reason, it is recommended to use it instead of `Ownership#take()`.
 *
 * ```ts
 * let _dst = ownership.take()
 * ownership // type `Ownership<...>`
 * // safe
 * take(ownership, (value) => (_dst = value))
 * ownership // type `never`
 * ```
 *
 * @throws
 *
 * When `throwOnWrongState` setting is enabled (`true` by default), throws an 'Unable to take (not settled) ...' error \
 * if ownership of the value has not yet been returned as a result of sequential `give`, `borrow`, and `release/drop` calls.
 *
 * This is due to internal tracking of the ownership/borrowing status.
 *
 * ```ts
 * const ownership = new Ownership<number>().capture(123 as const).give()
 * take(ownership, (value) => (_dst = value)) // Error: Unable to take (not settled), call `release` or `drop` first or remove `give` call
 * ```
 *
 * Also throws 'Unable to take (already taken)' error when trying to call again on the same `Ownership` instance.
 *
 * ```ts
 * const ownership = new Ownership<number>().capture(123 as const)
 * take(ownership, (value) => (_dst = value))
 * take(ownership, (value) => (_dst = value)) // Error: Unable to take (already taken)
 * ```
 *
 * @see https://github.com/valooford/borrowing#take
 */
export function take<T extends OwnershipTypes.AnyOwnership, TMap extends OwnershipTypes._inferTypes<T>>(
  ownership: T | undefined,
  receiver: (value: NonNullable<TMap['Captured']>, payload: TMap['ReleasePayload']) => void,
): asserts ownership is undefined {
  isOwnership<TMap>(ownership)
  if (ownership.state !== 'settled' && ownership.options.throwOnWrongState) {
    throw Error('Unable to take (not settled), call `release` or `drop` first or remove `give` call')
  }
  const { takenPlaceholder } = ownership.options
  if (
    ownership.captured === takenPlaceholder &&
    ownership.releasePayload === takenPlaceholder &&
    ownership.options.throwOnWrongState
  ) {
    throw Error('Unable to take (already taken)')
  }
  receiver(ownership.captured, ownership.releasePayload)
  ownership.captured = takenPlaceholder
  ownership.releasePayload = takenPlaceholder
}
