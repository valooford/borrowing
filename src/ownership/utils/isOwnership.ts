import type { InternalConsumerOwnership } from '../interfaces'
import type * as OwnershipTypes from '../types'

import { BaseOwnership } from '../ownership'

export function isOwnership<T extends OwnershipTypes._GenericBounds>(
  ownership: OwnershipTypes.AnyOwnership | undefined,
): asserts ownership is InternalConsumerOwnership<
  T['General'],
  T['Captured'],
  T['State'],
  T['ReleasePayload']
> {
  if (!(ownership instanceof BaseOwnership)) throw Error('Not an Ownership')
}
