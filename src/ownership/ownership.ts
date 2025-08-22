import type { InternalConsumerOwnership, Ownership, ProviderOwnership } from './interfaces'
import type * as OwnershipTypes from './types'
import type { Branded } from '@shared/types'

export class BaseOwnership<
  General,
  Captured = General,
  State extends OwnershipTypes.TypeState = Branded<'settled', 'released'>,
  ReleasePayload = unknown,
> {
  protected captured: Captured
  // @ts-expect-error: undefined is acceptable before `release` assertion call
  protected releasePayload: ReleasePayload
  private _state: OwnershipTypes.State = 'settled'
  protected get state() {
    return this._state
  }
  protected set state(value: OwnershipTypes.State) {
    this._state = value
  }
  protected readonly options: OwnershipTypes.Options = {
    throwOnWrongState: true,
    takenPlaceholder: undefined,
  }
  constructor(options?: Partial<OwnershipTypes.Options>) {
    this.options = {
      ...this.options,
      throwOnWrongState: options?.throwOnWrongState ?? this.options.throwOnWrongState,
      takenPlaceholder:
        options && Object.hasOwn(options, 'takenPlaceholder')
          ? options.takenPlaceholder
          : this.options.takenPlaceholder,
    }
    this.captured = this.options.takenPlaceholder
  }
  protected capture<Captured extends General>(value: Captured) {
    const self = this as unknown as InternalConsumerOwnership<General, Captured, State, ReleasePayload>
    self.captured = value
    return self as unknown as Ownership<General, Captured, State, ReleasePayload>
  }
  protected expectPayload<ReleasePayload>() {
    return this as unknown as Ownership<General, Captured, State, ReleasePayload>
  }
  protected give() {
    // `| undefined` is crucial here - it allows to narrow down `Captured` nicely (after `release` assertion call)
    const self = this as unknown as InternalConsumerOwnership<General, General | undefined, 'unknown', ReleasePayload>
    if (this.state === 'settled') {
      self.state = 'given'
    }
    return self as unknown as ProviderOwnership<General, General | undefined, 'unknown', ReleasePayload> | undefined
  }
  protected take() {
    const value = this.captured
    this.captured = undefined as any
    return value
  }
}
