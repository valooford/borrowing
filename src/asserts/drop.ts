import type * as OwnershipTypes from '@ownership/types'

import { isOwnership } from '@ownership/utils/isOwnership'

/** @see https://github.com/valooford/borrowing/blob/main/README.md */
export function drop<T extends OwnershipTypes._GenericBounds>(
  ownership: OwnershipTypes.ParamsBounds<T>,
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
  ownership.released = undefined
  ownership.captured = undefined
  if (arguments.length == 2) ownership.releasePayload = payload
  ownership.state = 'settled'
}
