import type { InternalConsumerOwnership, ProviderOwnership } from './interfaces'
import type { BaseOwnership } from './ownership'
import type { Branded, BrandOf } from '@shared/types'

export type AnyOwnership<T = any> =
  | InternalConsumerOwnership<T, any, any, any, any>
  | BaseOwnership<T, any, any, any, any>

export interface Options {
  throwOnWrongState: boolean
}
export type State = 'given' | 'borrowed' | 'settled'
export type TypeState = State | 'unknown'

export type _inferTypes<T extends AnyOwnership> =
  T extends BaseOwnership<infer General, infer Captured, infer Released, infer State, infer ReleasePayload>
    ? {
        General: General
        Captured: Captured
        Released: Released
        State: State
        ReleasePayload: ReleasePayload
      }
    : never

export interface _GenericBounds<General = any, ReleasePayload = any, Captured = any, Released = any, State = any> {
  General: General
  Captured: Captured
  Released: Released
  State: State
  ReleasePayload: ReleasePayload
}
export type ParamsBounds<T extends _GenericBounds> =
  | BaseOwnership<T['General'], T['Captured'] | undefined, T['Released'] | undefined, T['State'], T['ReleasePayload']>
  | undefined
export type PubParamsBounds<T extends _GenericBounds> =
  | BaseOwnership<T['General'], T['Captured'] | undefined, T['Released'] | undefined, T['State'], T['ReleasePayload']>
  | undefined

export type _MorphAssertion<
  T extends _GenericBounds,
  ReleasedT extends T['Released'],
  Fallback extends ProviderOwnership<
    T['General'],
    any,
    T['Released'] | undefined,
    T['State'],
    T['ReleasePayload']
  > = ProviderOwnership<T['General'], any, T['Released'] | undefined, T['State'], T['ReleasePayload']>,
> =
  BrandOf<T['State']> extends 'released'
    ? Fallback
    : ProviderOwnership<T['General'], undefined, ReleasedT, Branded<T['State'], 'released'>, T['ReleasePayload']>

export type _LeaveAssertion<
  T extends _GenericBounds,
  Fallback extends ProviderOwnership<
    T['General'],
    any,
    T['Released'] | undefined,
    T['State'],
    T['ReleasePayload']
  > = ProviderOwnership<T['General'], any, T['Released'] | undefined, T['State'], T['ReleasePayload']>,
> =
  BrandOf<T['State']> extends 'released'
    ? Fallback
    : ProviderOwnership<T['General'], undefined, undefined, Branded<T['State'], 'released'>, T['ReleasePayload']>
