import type * as OwnershipTypes from '@ownership/types'

import { isOwnership } from '@ownership/utils/isOwnership'
import { isFunction } from '@shared/utils'

export function take<T extends OwnershipTypes._GenericBounds>(
  ownership: OwnershipTypes.ParamsBounds<T>,
  receiver: Record<string, T['Released']> | ((value: T['Released']) => void),
  receiverKey?: keyof Exclude<typeof receiver, (...args: any[]) => void>,
): asserts ownership is undefined {
  isOwnership<T>(ownership)
  if (ownership.state !== 'settled' && ownership.options.throwOnWrongState) {
    throw Error('Unable to take (not settled), call `release` or `drop` first')
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
