import type * as OwnershipTypes from './types'
import type { Branded } from '@shared/types'

import { BaseOwnership } from './ownership'

/**
 * @summary
 *
 * A constructor of primitives that define ownership over a value of a particular type. \
 * The General type of the value is specified in the generic parameter list.
 *
 * @example
 *
 * ```ts
 * type Status = 'pending' | 'success' | 'error'
 * const ownership = new Ownership<Status>({ throwOnWrongState: false }) // type `Ownership<Status, unknown, ...>`
 * ```
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
  State extends OwnershipTypes.TypeState = Branded<'settled', 'released'>,
  ReleasePayload = unknown,
> extends BaseOwnership<General, Captured, State, ReleasePayload> {
  /**
   * @summary
   *
   * Contains the captured value until the `Ownership` instance is processed by the assertion function. \
   * Is public inside the assertion function. In external code, retrieved via the `take()` function or method.
   *
   * @example
   *
   * ```ts
   * type Status = 'pending' | 'success' | 'error'
   * const ownership = new Ownership<Status>().capture('pending' as const)
   * const captured = ownership.captured // type 'pending'
   *
   * function _assert<T extends Ownership.GenericBounds<Status>>(
   *   ownership: Ownership.ParamsBounds<T> | undefined,
   * ): asserts ownership is Ownership.LeaveAssertion<T> {
   *   borrow(ownership)
   *   const captured = ownership.captured // type `Status`
   * }
   * ```
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
   * | Option            | Type      | Default | Description                                                                               | \
   * | ----------------- | --------- | ------- | ----------------------------------------------------------------------------------------- | \
   * | throwOnWrongState | `boolean` | `true`  | Throw error when ownership/borrowing state changes fail via built-in assertion functions. |
   *
   * @see https://github.com/valooford/borrowing#ownershipoptions
   */
  declare options: OwnershipTypes._Options
  /**
   * @summary
   *
   * Sets the value over which ownership is defined. \
   * It is recommended to use the literal form of the value in combination with the `as const` assertion.
   *
   * @example
   *
   * ```ts
   * type Status = 'pending' | 'success' | 'error'
   * const ownership = new Ownership<Status>().capture('pending' as const) // type `Ownership<Status, 'pending', ...>`
   * ```
   *
   * @see https://github.com/valooford/borrowing#ownershipcapture
   */
  public override capture<Captured extends General>(
    value: Captured,
  ): Ownership<General, Captured, State, ReleasePayload> {
    return super.capture(value)
  }
  /**
   * @summary
   *
   * Specifies for an `Ownership` instance the type of value
   * that can be passed from the assertion function during its execution.
   *
   * The payload is set in the body of the assertion function
   * when calling `release` (3rd argument) or `drop` (2nd argument). \
   * The passed value is retrieved in external code
   * via the `take` (2nd callback parameter) or `drop` (1st callback parameter) functions.
   *
   * @example
   *
   * ```ts
   * const acceptExitCode = ownership.expectPayload<0 | 1>().give()
   * _assert(acceptExitCode)
   * drop(acceptExitCode, (payload) => {
   *   payload // 0
   * })
   * // same as `take(acceptExitCode, (_, payload) => { ... })`
   *
   * function _assert<T extends Ownership.GenericBounds<number, 0 | 1>>(
   *   ownership: Ownership.ParamsBounds<T> | undefined,
   * ): asserts ownership is Ownership.LeaveAssertion<T> {
   *   borrow(ownership)
   *   drop(ownership, 0) // same as `release(ownership, undefined, 0)`
   * }
   * ```
   *
   * @see https://github.com/valooford/borrowing#ownershipexpectpayload
   */
  public override expectPayload<ReleasePayload>(): Ownership<General, Captured, State, ReleasePayload> {
    return super.expectPayload<ReleasePayload>()
  }
  /**
   * @summary
   *
   * Prepares an `Ownership` instance to be given into the assertion function.
   *
   * @example
   *
   * ```ts
   * const ownership = new Ownership<string>().capture('pending' as const)
   * const ownershipArg = ownership.give()
   * _assert(ownership)
   * ownership // type `never`
   * _assert(ownershipArg)
   * ownershipArg // type `ProviderOwnership<...>`
   *
   * function _assert<T extends Ownership.GenericBounds<string>>(
   *   ownership: Ownership.ParamsBounds<T> | undefined,
   * ): asserts ownership is Ownership.MorphAssertion<T, 'success'> {
   *   // (...)
   * }
   * ```
   *
   * @see https://github.com/valooford/borrowing#ownershipgive
   */
  public override give(): ProviderOwnership<General, General | undefined, 'unknown', ReleasePayload> | undefined {
    return super.give()
  }
  /**
   * @summary
   *
   * Retrieves the captured value. \
   * After retrieval, the `Ownership` instance no longer contains a value.
   *
   * @example
   *
   * ```ts
   * type Status = 'pending' | 'success' | 'error'
   * const ownership = new Ownership<Status>().capture('pending' as const)
   * let _value = ownership.take() // 'pending'
   * _value = ownership.take() // undefined
   * ```
   *
   * @description
   *
   * The `take` method does not invalidate the `Ownership` instance. \
   * For this reason, it is recommended to use the `take()` function.
   *
   * ```ts
   * // unsafe because the ownership is still in use (not `undefined` or `never`)
   * _morphedValue = ownership.take()
   *
   * // safer alternative - asserts `ownership is never`
   * take(ownership, (str) => void (_morphedValue = str))
   * ```
   *
   * @see https://github.com/valooford/borrowing#ownershiptake
   */
  public override take(): Captured {
    return super.take()
  }
}

export declare namespace Ownership {
  /** Runtime borrowing mechanism settings. */
  export type Options = OwnershipTypes._Options
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
  export type MorphAssertion<T extends GenericBounds, ReleasedT extends T['Captured']> = OwnershipTypes._MorphAssertion<
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
  State extends OwnershipTypes.TypeState = Branded<'settled', 'released'>,
  ReleasePayload = unknown,
> extends BaseOwnership<General, Captured, State, ReleasePayload> {
  declare captured: Captured
  declare releasePayload: ReleasePayload

  public override get state() {
    return this.state
  }
  public override set state(value: OwnershipTypes.State) {
    this.state = value
  }

  declare options: OwnershipTypes._Options
}

export class ProviderOwnership<
  General,
  Captured = unknown,
  State extends OwnershipTypes.TypeState = Branded<'settled', 'released'>,
  ReleasePayload = unknown,
> extends BaseOwnership<General, Captured, State, ReleasePayload> {
  /**
   * @summary
   *
   * Specifies for an `Ownership` instance the type of value
   * that can be passed from the assertion function during its execution.
   *
   * @example
   *
   * ```ts
   * const acceptExitCode = ownership.expectPayload<0 | 1>().give()
   * _assert(acceptExitCode)
   *
   * function _assert<T extends Ownership.GenericBounds<number, 0 | 1>>(
   *   ownership: Ownership.ParamsBounds<T> | undefined,
   * ): asserts ownership is Ownership.LeaveAssertion<T> {
   *   borrow(ownership)
   *   drop(ownership, 0)
   * }
   * ```
   *
   * @see https://github.com/valooford/borrowing#ownershipexpectpayload
   */
  public override expectPayload<ReleasePayload>(): Ownership<General, Captured, State, ReleasePayload> {
    return super.expectPayload<ReleasePayload>()
  }
  /**
   * @summary
   *
   * Prepares an `Ownership` instance to be given into the assertion function.
   *
   * @example
   *
   * ```ts
   * const ownership = new Ownership<string>().capture('pending' as const)
   * const ownershipArg = ownership.give()
   * _assert(ownership)
   * ownership // type `never`
   * _assert(ownershipArg)
   * ownershipArg // type `ProviderOwnership<...>`
   *
   * function _assert<T extends Ownership.GenericBounds<string>>(
   *   ownership: Ownership.ParamsBounds<T> | undefined,
   * ): asserts ownership is Ownership.MorphAssertion<T, 'success'> {
   *   // (...)
   * }
   * ```
   *
   * @see https://github.com/valooford/borrowing#ownershipgive
   */
  public override give(): ProviderOwnership<General, General | undefined, 'unknown', ReleasePayload> | undefined {
    return super.give()
  }
  /**
   * @summary
   *
   * Retrieves the captured value. \
   * After retrieval, the `Ownership` instance no longer contains a value.
   *
   * @example
   *
   * ```ts
   * type Status = 'pending' | 'success' | 'error'
   * const ownership = new Ownership<Status>().capture('pending' as const)
   * let _value = ownership.take() // 'pending'
   * _value = ownership.take() // undefined
   * ```
   *
   * @description
   *
   * The `take` method does not invalidate the `Ownership` instance. \
   * For this reason, it is recommended to use the `take()` function.
   *
   * ```ts
   * // unsafe because the ownership is still in use (not `undefined` or `never`)
   * _morphedValue = ownership.take()
   *
   * // safer alternative - asserts `ownership is never`
   * take(ownership, (str) => void (_morphedValue = str))
   * ```
   *
   * @see https://github.com/valooford/borrowing#ownershiptake
   */
  public override take(): Captured {
    return super.take()
  }
}

export class ConsumerOwnership<
  General,
  Captured = unknown,
  State extends OwnershipTypes.TypeState = Branded<'settled', 'released'>,
  ReleasePayload = unknown,
> extends BaseOwnership<General, Captured, State, ReleasePayload> {
  /**
   * @summary
   *
   * Contains the captured value until the `Ownership` instance is processed by the assertion function. \
   * Is public inside the assertion function. In external code, retrieved via the `take()` function or method.
   *
   * @example
   *
   * ```ts
   * type Status = 'pending' | 'success' | 'error'
   * const ownership = new Ownership<Status>().capture('pending' as const)
   * const captured = ownership.captured // type 'pending'
   *
   * function _assert<T extends Ownership.GenericBounds<Status>>(
   *   ownership: Ownership.ParamsBounds<T> | undefined,
   * ): asserts ownership is Ownership.LeaveAssertion<T> {
   *   borrow(ownership)
   *   const captured = ownership.captured // type `Status`
   * }
   * ```
   *
   * @see https://github.com/valooford/borrowing#consumerownershipcaptured
   */
  declare readonly captured: Captured
}
