import type { InternalConsumerOwnership, Ownership, ProviderOwnership } from './interfaces'
import type * as OwnershipTypes from './types'
import type { Branded } from '@shared/types'

export class BaseOwnership<
  General,
  Captured = General,
  Released = General,
  State extends OwnershipTypes.TypeState = Branded<'settled', 'released'>,
  ReleasePayload = unknown,
> {
  // @ts-expect-error: undefined is acceptable before `capture` method call
  protected captured: Captured
  // @ts-expect-error: undefined is acceptable before `capture` method call
  protected released: Released
  // @ts-expect-error: undefined is acceptable before `release` assertion call
  protected releasePayload: ReleasePayload
  private _state: OwnershipTypes.State = 'settled'
  protected get state() {
    return this._state
  }
  protected set state(value: OwnershipTypes.State) {
    this._state = value
  }
  protected options: OwnershipTypes.Options = {
    throwOnWrongState: true,
  }
  constructor(options?: OwnershipTypes.Options) {
    this.options = {
      ...this.options,
      throwOnWrongState: options?.throwOnWrongState ?? this.options.throwOnWrongState,
    }
  }
  protected capture<Captured>(value: Captured) {
    const self = this as unknown as InternalConsumerOwnership<General, undefined, Captured, State, ReleasePayload>
    self.captured = undefined
    self.released = value
    return self as unknown as Ownership<General, Captured, undefined, State, ReleasePayload>
  }
  protected expectPayload<ReleasePayload>() {
    return this as unknown as Ownership<General, Captured, Released, State, ReleasePayload>
  }
  protected give() {
    // `| undefined` is crucial here - it allows to narrow from `Captured & Released` to `Released` only (after `release` assertion call)
    const self = this as unknown as InternalConsumerOwnership<
      General,
      General | undefined,
      General | undefined,
      'unknown',
      ReleasePayload
    >
    if (this.state === 'settled') {
      self.captured = this.released as any
      self.released = undefined
      self.state = 'given'
    }
    return self as unknown as
      | ProviderOwnership<General, General | undefined, General | undefined, 'unknown', ReleasePayload>
      | undefined
  }
  protected take() {
    const value = this.released
    this.released = undefined as any
    return value
  }
}
