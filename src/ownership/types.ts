import type { InternalConsumerOwnership, ProviderOwnership } from './interfaces'
import type { BaseOwnership } from './ownership'
import type { Branded, BrandOf } from '@shared/types'

export type AnyOwnership<T = any> = InternalConsumerOwnership<T, any, any, any> | BaseOwnership<T, any, any, any>

export interface _Options {
  throwOnWrongState: boolean
  takenPlaceholder: any
}
export type State = 'given' | 'borrowed' | 'settled'
export type TypeState = State | 'unknown'

//* don't name type parameters the same as exported members
//* they conflict when `tsdown` generates declaration files (`tsup` is OK)
export type _inferTypes<T extends AnyOwnership> =
  T extends BaseOwnership<infer General, infer Captured, infer _State, infer ReleasePayload>
    ? {
        General: General
        Captured: Captured
        State: _State
        ReleasePayload: ReleasePayload
      }
    : never

//* don't name type parameters the same as public type parameters (`Ownership.GenericBounds<...>`)
//* causes `api-extractor` to throw a mysterious ERROR: Child declaration not found for the specified node
export interface _GenericBounds<$General = any, $ReleasePayload = any, $Captured = any, $State = any> {
  General: $General
  Captured: $Captured
  State: $State
  ReleasePayload: $ReleasePayload
}
export type ParamsBounds<T extends _GenericBounds> =
  | BaseOwnership<T['General'], T['Captured'] | undefined, T['State'], T['ReleasePayload']>
  | undefined
export type PubParamsBounds<T extends _GenericBounds> =
  | BaseOwnership<T['General'], T['Captured'] | undefined, T['State'], T['ReleasePayload']>
  | undefined

export type _MorphAssertion<
  T extends _GenericBounds,
  ReleasedT extends T['Captured'],
  Fallback extends ProviderOwnership<
    T['General'],
    T['Captured'] | undefined,
    T['State'],
    T['ReleasePayload']
  > = ProviderOwnership<T['General'], T['Captured'] | undefined, T['State'], T['ReleasePayload']>,
> =
  BrandOf<T['State']> extends 'released'
    ? Fallback
    : ProviderOwnership<T['General'], ReleasedT, Branded<T['State'], 'released'>, T['ReleasePayload']>

export type _LeaveAssertion<
  T extends _GenericBounds,
  Fallback extends ProviderOwnership<
    T['General'],
    T['Captured'] | undefined,
    T['State'],
    T['ReleasePayload']
  > = ProviderOwnership<T['General'], T['Captured'] | undefined, T['State'], T['ReleasePayload']>,
> =
  BrandOf<T['State']> extends 'released'
    ? Fallback
    : ProviderOwnership<T['General'], undefined, Branded<T['State'], 'released'>, T['ReleasePayload']>
