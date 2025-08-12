import type { ConsumerOwnership } from '@ownership/interfaces'
import type * as OwnershipTypes from '@ownership/types'

import { isPubOwnership } from '@ownership/utils/isPubOwnership'

export function borrow<T extends OwnershipTypes._GenericBounds>(
  ownership: OwnershipTypes.PubParamsBounds<T>,
): asserts ownership is ConsumerOwnership<T['General'], T['General'], any, any, T['ReleasePayload']> {
  isPubOwnership(ownership)
  if (ownership.state !== 'given' && ownership.options.throwOnWrongState) {
    throw Error('Unable to borrow (not given), call `give` first')
  }
  ownership.state = 'borrowed'
}
