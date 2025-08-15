import type * as OwnershipTypes from '@ownership/types'

import { isOwnership } from '@ownership/utils/isOwnership'
import { isFunction } from '@shared/utils'

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
 * // or
 * const dst: { current?: number } = {}
 * take(ownership, dst, 'current')
 * ```
 *
 * @description
 *
 * The `take` function invalidates the `Ownership` parameter by narrowing it to `never`. \
 * For this reason, it is recommended to use it instead of `Ownership#take()`.
 *
 * ```ts
 * const _dst = ownership.take()
 * ownership // type `Ownership<...>`
 * // safe
 * const dst: { current?: number } = {}
 * take(ownership, dst, 'current')
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
 * const ownership = new Ownership<number>().capture(123 as number).give()
 * take(ownership, dst) // Error: Unable to take (not settled), call `release` or `drop` first or remove `give` call
 * ```
 *
 * Also throws 'Unable to take (already taken)' error when trying to call again on the same `Ownership` instance.
 *
 * ```ts
 * declare let ownership: ProviderOwnership<...>
 * take(ownership, dst)
 * take(ownership, dst) // Error: Unable to take (already taken)
 * ```
 *
 * @see https://github.com/valooford/borrowing/blob/main/README.md#take
 */
export function take<T extends OwnershipTypes._GenericBounds>(
  ownership: OwnershipTypes.ParamsBounds<T>,
  receiver: Record<string, T['Released']> | ((value: T['Released']) => void),
  receiverKey?: keyof Exclude<typeof receiver, (...args: any[]) => void>,
): asserts ownership is undefined {
  isOwnership<T>(ownership)
  if (ownership.state !== 'settled' && ownership.options.throwOnWrongState) {
    throw Error('Unable to take (not settled), call `release` or `drop` first or remove `give` call')
  }
  if (!ownership.released && ownership.options.throwOnWrongState) {
    throw Error('Unable to take (already taken)')
  }
  if (isFunction(receiver)) {
    receiver(ownership.released)
  } else if (receiverKey) {
    receiver[receiverKey] = ownership.released
  }
  ownership.released = undefined
}
