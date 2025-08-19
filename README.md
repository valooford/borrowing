<div align="center">

# <img src="header.svg" alt="borrowing" style="width: 100%; max-height: 180px">

<p align="center">
  <a href="https://www.npmjs.com/package/borrowing">
    <img alt="npm" src="https://img.shields.io/npm/v/borrowing">
  </a>
</p>

Allows you to pass values to a function and get the most accurate value type  
in the following code:

<ul align="left">

- either Morphed one  
  `{value: 'open'}` >>> `{value: 'closed'}`
- or no longer under control (Leaved)  
  `{value: 'closed'}` >>> `undefined`

</ul>

<p align="center">
  <a href="https://github.com/valooford/borrowing/stargazers">Become a 🧙Stargazer</a>
  |
  <a href="https://github.com/valooford/valooford#support">Support the author</a>
</p>

---

</div>

English | [Русский](./README.ru-RU.md)

## Example

```ts
import { Ownership } from 'borrowing'

import { replaceStr, sendMessage } from './lib'

const value = 'Hello, world!' as const // type 'Hello, world!'
let ownership = new Ownership<string>().capture(value).give()
replaceStr(ownership, 'M0RPH3D W0R1D')
let morphedValue = ownership.take() // new type 'M0RPH3D W0R1D' | (*)

ownership // type `Ownership<string, 'M0RPH3D W0R1D', ...>`
ownership = ownership.give()
sendMessage(ownership)
ownership // new type `undefined`
```

Implementation of assertions functions:

```ts
// lib.ts
import { borrow, drop, Ownership, release } from 'borrowing'

export function replaceStr<V extends string, T extends Ownership.GenericBounds<string>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
  value: V,
): asserts ownership is Ownership.MorphAssertion<T, V> {
  release(ownership, value)
}

export function sendMessage<T extends Ownership.GenericBounds<string>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is undefined {
  borrow(ownership)
  const value = ownership.captured // type `string`
  fetch('https://web.site/api/log', { method: 'POST', body: value })
  drop(ownership)
}
```

---

# Table of Contents

- [Resources](#resources)
- [API Reference](#api-reference)
  - [`Ownership`](#ownership)
    - [`Ownership#options`](#ownershipoptions)
    - [`ConsumerOwnership#captured`](#consumerownershipcaptured)
    - [`Ownership#capture()`](#ownershipcapture)
    - [`Ownership#expectPayload()`](#ownershipexpectpayload)
    - [`Ownership#give()`](#ownershipgive)
    - [`Ownership#take()`](#ownershiptake)
    - [Utility Types](#utility-types)
  - [`borrow`](#borrow)
  - [`release`](#release)
  - [`drop`](#drop)
  - [`take`](#take)

## Resources

- [Assertion functions in TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)

> [!tip]
>
> Use in combination with `no-unsafe-*`-rules from [`typescript-eslint`](https://typescript-eslint.io/), such as [`no-unsafe-call`](https://typescript-eslint.io/rules/no-unsafe-call/).  
> This prevents further use of the Ownership instance, either after calling `take()` or after any other assertion that results in `never`.

## API Reference

### `Ownership`

> [**Ownership**](https://github.com/valooford/borrowing/blob/main/src/ownership/ownership.ts)([options?](#ownershipoptions)): `Ownership<General, Captured, State, ReleasePayload>`

**@summary**

A constructor of primitives that define ownership over a value of a particular type. \
The General type of the value is specified in the generic parameter list.

**@example**

```ts
type Status = 'pending' | 'success' | 'error'
const ownership = new Ownership<Status>({ throwOnWrongState: false }) // type `Ownership<Status, unknown, ...>`
```

**@description**

It is the source and target type of assertion functions.

In combination with assertion functions, it implements borrowing mechanisms through modification of its own type. \
The type of `Ownership` instance reflects both the type of the captured value and the borrowing state.

#### `Ownership#options`

**@summary**

Allows to customize aspects of how borrowing mechanisms work at runtime. \
Are public before any use of the `Ownership` instance.

| Option            | Type      | Default     | Description                                                                                          |
| ----------------- | --------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| throwOnWrongState | `boolean` | `true`      | Throw error when ownership/borrowing state changes fail via built-in assertion functions.            |
| takenPlaceholder  | `any`     | `undefined` | Override an "empty" value for `Ownership`. Useful if the captured value's type includes `undefined`. |

#### `ConsumerOwnership#captured`

**@summary**

Contains the captured value until the `Ownership` instance is processed by the assertion function. \
Is public inside the assertion function. In external code, retrieved via the `take()` function or method.

**@example**

```ts
type Status = 'pending' | 'success' | 'error'
const ownership = new Ownership<Status>().capture('pending' as const)
const captured = ownership.captured // type 'pending'

function _assert<T extends Ownership.GenericBounds<Status>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  borrow(ownership)
  const captured = ownership.captured // type `Status`
}
```

#### `Ownership#capture()`

**@summary**

Sets the value over which ownership is defined. \
It is recommended to use the literal form of the value in combination with the `as const` assertion.

**@example**

```ts
type Status = 'pending' | 'success' | 'error'
const ownership = new Ownership<Status>().capture('pending' as const) // type `Ownership<Status, 'pending', ...>`
```

#### `Ownership#expectPayload()`

**@summary**

Specifies for an `Ownership` instance the type of value
that can be passed from the assertion function during its execution.

**@example**

```ts
const acceptExitCode = ownership.expectPayload<0 | 1>().give()
_assert(acceptExitCode)
take(acceptExitCode, (_, payload) => {
  payload // 0
})

function _assert<T extends Ownership.GenericBounds<number, 0 | 1>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  borrow(ownership)
  drop(ownership, 0)
}
```

#### `Ownership#give()`

**@summary**

Prepares an `Ownership` instance to be given into the assertion function.

**@example**

```ts
const ownership = new Ownership<string>().capture('pending' as const)
const ownershipArg = ownership.give()
_assert(ownership)
ownership // type `never`
_assert(ownershipArg)
ownershipArg // type `ProviderOwnership<...>`

function _assert<T extends Ownership.GenericBounds<string>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.MorphAssertion<T, 'success'> {
  // (...)
}
```

#### `Ownership#take()`

**@summary**

Retrieves the captured value. \
After retrieval, the `Ownership` instance no longer contains a value.

**@example**

```ts
type Status = 'pending' | 'success' | 'error'
const ownership = new Ownership<Status>().capture('pending' as const)
let _value = ownership.take() // 'pending'
_value = ownership.take() // undefined
```

**@description**

The `take` method does not invalidate the `Ownership` instance. \
For this reason, it is recommended to use the `take()` function.

```ts
// unsafe because the ownership is still in use (not `undefined` or `never`)
_morphedValue = ownership.take()

// safer alternative - asserts `ownership is never`
take(ownership, (str) => void (_morphedValue = str))
```

[Scroll Up ↩](#table-of-contents)

#### Utility Types

| `Ownership` namespace                                                                | Description                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Ownership.Options`                                                                  | Runtime borrowing mechanism settings.                                                                                                                                                                                              |
| `Ownership.inferTypes<T>`<br>└─`T extends Ownership`                                 | The instance parameter types individually, such as `inferTypes<typeof ownership>['Captured']`.                                                                                                                                     |
| `Ownership.GenericBounds<G,RP>`<br>├─`G` - `General`<br>└─`RP` - `ReleasePayload`    | For use in the parameter list of a generic assertion function to perform a mapping from the type of the actual `Ownership` instance passed.<br>The resulting type is a structure convenient for use in `*Assertion` utility types. |
| `Ownership.ParamsBounds<T>`<br>└─`T extends GenericBounds`                           | For use as the type of an assertion function parameter that takes an `Ownership` instance.<br>A generic parameter extending `GenericBounds` is passed inside to ensure successful mapping.                                         |
| `Ownership.MorphAssertion<T,R>`<br>├─`T extends GenericBounds`<br>└─`R` - `Released` | The target type of an assertion function that results in `Ownership` with a potentially morphed type of the captured value.                                                                                                        |
| `Ownership.LeaveAssertion<T>`<br>└─`T extends GenericBounds`                         | The target type of an assertion function that consumes a borrowed value completely and invalidates the `Ownership` type.                                                                                                           |

**@example**

```ts
const options: Ownership.Options = {
  throwOnWrongState: false,
  takenPlaceholder: undefined,
}
const _ownership = new Ownership<string>(options).capture('foo' as const)
type Captured = Ownership.inferTypes<typeof _ownership>['Captured'] // 'foo'

function _assert<T extends Ownership.GenericBounds<string>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.MorphAssertion<T, string> {
  // (...)
  release(ownership, 'bar')
}
function _throwAway<T extends Ownership.GenericBounds<string, 0 | 1>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  borrow(ownership)
  type Payload = Ownership.inferTypes<typeof ownership>['ReleasePayload'] // 0 | 1
  drop(ownership, 0)
}
```

[Scroll Up ↩](#table-of-contents)

### `borrow`

> [**borrow**](https://github.com/valooford/borrowing/blob/main/src/asserts/borrow.ts)(`Ownership`): asserts ownership is `ConsumerOwnership`

**@summary**

Narrows the type of `Ownership` inside the assertion function. \
This allows access to the captured value.

**@example**

```ts
function _assert<T extends Ownership.GenericBounds<number>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  borrow(ownership)
  const value = ownership.captured // type `number`
}
```

**@description**

When the `throwOnWrongState` setting is enabled (`true` by default), \
a call to the `borrow` function must precede a call to the `release` and `drop` assertion functions.

This is due to internal tracking of the ownership/borrowing status.

```ts
const ownership = new Ownership<number>().give()
_assert(ownership) // throws

function _assert<T extends Ownership.GenericBounds<number>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  release(ownership, value) // Error: Unable to release (not borrowed), call `borrow` first
}
```

**@throws**

When `throwOnWrongState` setting is enabled (`true` by default), throws an 'Unable to borrow ...' error \
if `give` has not been called before.

This is due to internal tracking of the ownership/borrowing status.

```ts
const ownership = new Ownership<number>()
_assert(ownership) // throws

function _assert<T extends Ownership.GenericBounds<number>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  borrow(ownership) // Error: Unable to borrow (not given), call `give` first
}
```

[Scroll Up ↩](#table-of-contents)

### `release`

> [**release**](https://github.com/valooford/borrowing/blob/main/src/asserts/release.ts)(`Ownership`, _value_ | _setValue_, _payload_): asserts ownership is `never`

**@summary**

Morphs a captured value. \
Allows the assertion function to return a payload.

**@example**

```ts
type Status = 'open' | 'closed'
enum Result {
  Ok,
  Err,
}
function close<T extends Ownership.GenericBounds<Status, Result>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.MorphAssertion<T, 'closed'> {
  borrow(ownership)
  release(ownership, 'closed', Result.Ok)
}
```

**@description**

The `release` function narrows the passed `Ownership` to `never` in the body of the assertion function itself.

```ts
function _assert<T extends Ownership.GenericBounds>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.MorphAssertion<T, any> {
  borrow(ownership)
  release(ownership, (prev) => prev)
  ownership // type `never`
}
```

**@throws**

When `throwOnWrongState` setting is enabled (`true` by default), throws an 'Unable to release ...' error \
if the `give` and `borrow` functions were not called in sequence beforehand.

This is due to internal tracking of the ownership/borrowing status.

```ts
const ownership = new Ownership<number>().capture(123 as const).give()
_assert(ownership) // throws

function _assert<T extends Ownership.GenericBounds>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.MorphAssertion<T, any> {
  release(ownership, value) // Error: Unable to release (not borrowed), call `borrow` first
}
```

[Scroll Up ↩](#table-of-contents)

### `drop`

> [**drop**](https://github.com/valooford/borrowing/blob/main/src/asserts/drop.ts)(`Ownership`, _payload_): asserts ownership is `never`

**@summary**

Garbages a captured value. \
Allows the assertion function to return a payload.

**@example**

```ts
enum Result {
  Ok,
  Err,
}
function _assert<T extends Ownership.GenericBounds<any, Result>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  borrow(ownership)
  drop(ownership, Result.Ok)
}
```

**@description**

Is a shorthand form of the `release` function, which sets the captured value to `undefined`.

```ts
release(ownership, undefined, Result.Ok)
// same as
drop(ownership, Result.Ok)
```

The `drop` function narrows the passed `Ownership` to `never` in the body of the assertion function itself. \
Can be used inside an assertion function that
invalidates the `Ownership` parameter by narrowing it to `undefined`.

```ts
function _assert<T extends Ownership.GenericBounds<number>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is undefined {
  borrow(ownership)
  _assert(ownership)
  ownership // type `never`
}
```

**@throws**

When `throwOnWrongState` setting is enabled (`true` by default), throws an 'Unable to drop ...' error \
if the `give` and `borrow` functions were not called in sequence beforehand.

This is due to internal tracking of the ownership/borrowing status.

```ts
const ownership = new Ownership<number>().capture(123 as const).give()
_assert(ownership) // throws

function _assert<T extends Ownership.GenericBounds>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  // (...)
  drop(ownership) // Error: Unable to drop (not borrowed), call `borrow` first
}
```

[Scroll Up ↩](#table-of-contents)

### `take`

> [**take**](https://github.com/valooford/borrowing/blob/main/src/asserts/take.ts)(`Ownership`, receiver, receiverKey?): asserts ownership is `never`

**@summary**

Retrieves the captured value from the passed `Ownership`. \
After retrieval, the `Ownership` instance no longer contains a value and is of type `never`.

**@example**

```ts
const ownership = new Ownership<number>().capture(123 as const)
let _dst: number
take(ownership, (value) => (_dst = value))
```

**@description**

The `take` function invalidates the `Ownership` parameter by narrowing it to `never`. \
For this reason, it is recommended to use it instead of `Ownership#take()`.

```ts
let _dst = ownership.take()
ownership // type `Ownership<...>`
// safe
take(ownership, (value) => (_dst = value))
ownership // type `never`
```

**@throws**

When `throwOnWrongState` setting is enabled (`true` by default), throws an 'Unable to take (not settled) ...' error \
if ownership of the value has not yet been returned as a result of sequential `give`, `borrow`, and `release/drop` calls.

This is due to internal tracking of the ownership/borrowing status.

```ts
const ownership = new Ownership<number>().capture(123 as const).give()
take(ownership, (value) => (_dst = value)) // Error: Unable to take (not settled), call `release` or `drop` first or remove `give` call
```

Also throws 'Unable to take (already taken)' error when trying to call again on the same `Ownership` instance.

```ts
const ownership = new Ownership<number>().capture(123 as const)
take(ownership, (value) => (_dst = value))
take(ownership, (value) => (_dst = value)) // Error: Unable to take (already taken)
```

[Scroll Up ↩](#table-of-contents)
