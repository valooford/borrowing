import type { InternalConsumerOwnership } from '../interfaces'
import type * as OwnershipTypes from '../types'

import { BaseOwnership } from '../ownership'

type AnyPubOwnership<T = any> = BaseOwnership<T, any, any, any>
export function isPubOwnership<T extends OwnershipTypes._GenericBounds>(
  ownership: AnyPubOwnership | undefined,
): asserts ownership is InternalConsumerOwnership<T['General'], T['Captured'], T['State'], T['ReleasePayload']> {
  if (!(ownership instanceof BaseOwnership)) throw Error('Not an Ownership')
}
