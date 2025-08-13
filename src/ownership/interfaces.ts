import type * as OwnershipTypes from './types'
import type { Branded } from '@shared/types'

import { BaseOwnership } from './ownership'

/** @see https://github.com/valooford/borrowing/blob/main/README.md */
export class Ownership<
  General,
  Captured = unknown,
  Released = unknown,
  State extends OwnershipTypes.TypeState = Branded<'settled', 'released'>,
  ReleasePayload = unknown,
> extends BaseOwnership<General, Captured, Released, State, ReleasePayload> {
  declare readonly captured: Captured
  declare readonly released: Released
  declare options: OwnershipTypes.Options
  public override capture<Captured>(value: Captured) {
    return super.capture(value)
  }
  public override expectPayload<ReleasePayload>() {
    return super.expectPayload<ReleasePayload>()
  }
  public override give() {
    return super.give()
  }
  public override take() {
    return super.take()
  }
}

export namespace Ownership {
  export type Options = OwnershipTypes.Options
  export type infer<T> = OwnershipTypes._infer<T>

  export type inferTypes<T extends OwnershipTypes.AnyOwnership> = OwnershipTypes._inferTypes<T>

  export type GenericBounds<
    General = any,
    ReleasePayload = any,
    Captured = any,
    Released = any,
    State = any,
  > = OwnershipTypes._GenericBounds<General, ReleasePayload, Captured, Released, State>

  export type ParamsBounds<T extends GenericBounds> = OwnershipTypes.PubParamsBounds<T>

  export type MorphAssertion<T extends GenericBounds, ReleasedT extends T['Released']> = OwnershipTypes._MorphAssertion<
    T,
    ReleasedT
  >

  export type LeaveAssertion<T extends GenericBounds> = OwnershipTypes._LeaveAssertion<T>
}

export class InternalConsumerOwnership<
  General,
  Captured = unknown,
  Released = unknown,
  State extends OwnershipTypes.TypeState = Branded<'settled', 'released'>,
  ReleasePayload = unknown,
> extends BaseOwnership<General, Captured, Released, State, ReleasePayload> {
  declare captured: Captured
  declare released: Released
  declare releasePayload: ReleasePayload

  public override get state() {
    return this.state
  }
  public override set state(value: OwnershipTypes.State) {
    this.state = value
  }

  declare options: OwnershipTypes.Options
}

export class ProviderOwnership<
  General,
  Captured = unknown,
  Released = unknown,
  State extends OwnershipTypes.TypeState = Branded<'settled', 'released'>,
  ReleasePayload = unknown,
> extends BaseOwnership<General, Captured, Released, State, ReleasePayload> {
  public override expectPayload<ReleasePayload>() {
    return super.expectPayload<ReleasePayload>()
  }
  public override give() {
    return super.give()
  }
  public override take() {
    return super.take()
  }
}

export class ConsumerOwnership<
  General,
  Captured = unknown,
  Released = unknown,
  State extends OwnershipTypes.TypeState = Branded<'settled', 'released'>,
  ReleasePayload = unknown,
> extends BaseOwnership<General, Captured, Released, State, ReleasePayload> {
  declare readonly captured: Captured
  declare readonly released: Released
  declare readonly releasePayload: ReleasePayload
}
