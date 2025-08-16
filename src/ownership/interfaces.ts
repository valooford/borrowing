import type * as OwnershipTypes from './types'
import type { Branded } from '@shared/types'

import { BaseOwnership } from './ownership'

/**
 * @summary
 *
 * A constructor of primitives that define ownership over a value of a particular type. \
 * The General type of the value is specified in the generic parameter list.
 *
 * @description
 *
 * It is the source and target type of assertion functions.
 *
 * In combination with assertion functions, it implements borrowing mechanisms through modification of its own type. \
 * The type of `Ownership` instance reflects both the type of the captured value and the borrowing state.
 *
 * @see https://github.com/valooford/borrowing#ownership
 * @see https://github.com/valooford/borrowing#utility-types
 */
export class Ownership<
  General,
  Captured = unknown,
  Released = unknown,
  State extends OwnershipTypes.TypeState = Branded<'settled', 'released'>,
  ReleasePayload = unknown,
> extends BaseOwnership<General, Captured, Released, State, ReleasePayload> {
  /**
   * @summary
   *
   * Contains the captured value until the `Ownership` instance is processed by the assertion function. \
   * Is public inside the assertion function. In external code, retrieved via the `take()` function or method.
   *
   * @see https://github.com/valooford/borrowing#consumerownershipcaptured
   */
  declare readonly captured: Captured
  /**
   * @summary
   *
   * Allows to customize aspects of how borrowing mechanisms work at runtime. \
   * Are public before any use of the `Ownership` instance.
   *
   * | Option            | Type      | Default | Description                                                                               |
   * | ----------------- | --------- | ------- | ----------------------------------------------------------------------------------------- |
   * | throwOnWrongState | `boolean` | `true`  | Throw error when ownership/borrowing state changes fail via built-in assertion functions. |
   *
   * @see https://github.com/valooford/borrowing#ownershipoptions
   */
  declare options: OwnershipTypes.Options
  /**
   * @summary
   *
   * Sets the value over which ownership is defined. \
   * It is recommended to use the literal form of the value in combination with the `as const` assertion.
   *
   * @see https://github.com/valooford/borrowing#ownershipcapture
   */
  public override capture<Captured>(value: Captured) {
    return super.capture(value)
  }
  /**
   * @summary
   *
   * Specifies for an `Ownership` instance the type of value
   * that can be passed from the assertion function during its execution.
   *
   * @see https://github.com/valooford/borrowing#ownershipexpectpayload
   */
  public override expectPayload<ReleasePayload>() {
    return super.expectPayload<ReleasePayload>()
  }
  /**
   * @summary
   *
   * Prepares an `Ownership` instance to be given into the assertion function.
   *
   * @see https://github.com/valooford/borrowing#ownershipgive
   */
  public override give() {
    return super.give()
  }
  /**
   * @summary
   *
   * Retrieves the captured value. \
   * After retrieval, the `Ownership` instance no longer contains a value.
   *
   * @description
   *
   * The `take` method does not invalidate the `Ownership` instance. \
   * For this reason, it is recommended to use the `take()` function.
   *
   * ```ts
   * import { take } from 'borrowing'
   *
   * // unsafe because the ownership is still in use (not `undefined` or `never`)
   * let morphedValue = ownership.take()
   *
   * // safer alternative - asserts `ownership is never`
   * take(ownership, (str) => (morphedValue = str))
   * ```
   *
   * @see https://github.com/valooford/borrowing#ownershiptake
   */
  public override take() {
    return super.take()
  }
}

export namespace Ownership {
  /** Runtime borrowing mechanism settings. */
  export type Options = OwnershipTypes.Options
  /** The instance parameter types individually, such as `inferTypes<typeof ownership>['Captured']`. */
  export type inferTypes<T extends OwnershipTypes.AnyOwnership> = OwnershipTypes._inferTypes<T>
  /**
   * For use in the parameter list of a generic assertion function to perform a mapping
   * from the type of the actual `Ownership` instance passed. \
   * The resulting type is a structure convenient for use in `*Assertion` utility types.
   */
  export type GenericBounds<General = any, ReleasePayload = any> = OwnershipTypes._GenericBounds<
    General,
    ReleasePayload
  >
  /**
   * For use as the type of an assertion function parameter that takes an `Ownership` instance. \
   * A generic parameter extending `GenericBounds` is passed inside to ensure successful mapping.
   */
  export type ParamsBounds<T extends GenericBounds> = OwnershipTypes.PubParamsBounds<T>
  /**
   * The target type of an assertion function that results in `Ownership`
   * with a potentially morphed type of the captured value.
   */
  export type MorphAssertion<T extends GenericBounds, ReleasedT extends T['Released']> = OwnershipTypes._MorphAssertion<
    T,
    ReleasedT
  >
  /**
   * The target type of an assertion function that consumes a borrowed value completely
   * and invalidates the `Ownership` type.
   */
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
  /**
   * @summary
   *
   * Specifies for an `Ownership` instance the type of value
   * that can be passed from the assertion function during its execution.
   *
   * @see https://github.com/valooford/borrowing#ownershipexpectpayload
   */
  public override expectPayload<ReleasePayload>() {
    return super.expectPayload<ReleasePayload>()
  }
  /**
   * @summary
   *
   * Prepares an `Ownership` instance to be given into the assertion function.
   *
   * @see https://github.com/valooford/borrowing#ownershipgive
   */
  public override give() {
    return super.give()
  }
  /**
   * @summary
   *
   * Retrieves the captured value. \
   * After retrieval, the `Ownership` instance no longer contains a value.
   *
   * @description
   *
   * The `take` method does not invalidate the `Ownership` instance. \
   * For this reason, it is recommended to use the `take()` function.
   *
   * ```ts
   * import { take } from 'borrowing'
   *
   * // unsafe because the ownership is still in use (not `undefined` or `never`)
   * let morphedValue = ownership.take()
   *
   * // safer alternative - asserts `ownership is never`
   * take(ownership, (str) => (morphedValue = str))
   * ```
   *
   * @see https://github.com/valooford/borrowing#ownershiptake
   */
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
  /**
   * @summary
   *
   * Contains the captured value until the `Ownership` instance is processed by the assertion function. \
   * Is public inside the assertion function. In external code, retrieved via the `take()` function or method.
   *
   * @see https://github.com/valooford/borrowing#consumerownershipcaptured
   */
  declare readonly captured: Captured
}
