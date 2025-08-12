import type * as OwnershipTypes from '@ownership/types'

import { isOwnership } from '@ownership/utils/isOwnership'
import { isFunction } from '@shared/utils'

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
