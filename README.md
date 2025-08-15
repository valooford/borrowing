<div align="center">

# <img src="header.svg" alt="borrowing" style="width: 100%; max-height: 180px">

<p align="center">
  <a href="https://www.npmjs.com/package/borrowing" >
    <img alt="npm" src="https://img.shields.io/npm/v/borrowing">
  </a>
</p>

Allows you to pass values to a function and get the most accurate value type  
in the following code:

<ul align="left">

- either Morphed one  
  `{value: 'open'}` 🡢 `{value: 'closed'}`
- or no longer under control (Leaved)  
  `{value: 'closed'}` 🡢 `undefined`

</ul>

<hr/><br/>
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

ownership // type `Ownership<string, undefined, 'M0RPH3D W0R1D', ...>`
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

(\*) - Using `take()` is preferred over `Ownership#take()`

```ts
import { take } from 'borrowing'

// unsafe because the ownership is still in use (not `undefined` or `never`)
let morphedValue = ownership.take()

// safer alternative - asserts `ownership is never`
take(ownership, (str) => (morphedValue = str))
```

> [!tip]
>
> Use in combination with `no-unsafe-*`-rules from [`typescript-eslint`](https://typescript-eslint.io/), such as [`no-unsafe-call`](https://typescript-eslint.io/rules/no-unsafe-call/).  
> This prevents further use of the Ownership instance, either after calling `take()` or after any other assertion that results in `never`.

# Table of Contents

- [Resources](#resources)
- [API Reference](#api-reference)
  - [`Ownership`](#ownership)
    - [`Ownership#captured`](#ownershipcaptured)
    - [`Ownership#released`](#ownershipreleased)
    - [`ConsumerOwnership#releasePayload`](#consumerownershipreleasepayload)
    - [`Ownership#options`](#ownershipoptions)
    - [`Ownership#capture()`](#ownershipcapture)
    - [`Ownership#expectPayload()`](#ownershipexpectpayload)
    - [`Ownership#give()`](#ownershipgive)
    - [`Ownership#take()`](#ownershiptake)
    - [`Ownership` Utility Types](#utility-types)
  - [`borrow`](#borrow)
  - [`release`](#release)
  - [`drop`](#drop)
  - [`take`](#take)

## Resources

- [Assertion functions in TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)

## API Reference

### `Ownership`

### `Ownership`

#### `Ownership#captured`

#### `Ownership#released`

#### `ConsumerOwnership#releasePayload`

#### `Ownership#options`

#### `Ownership#capture()`

#### `Ownership#expectPayload()`

#### `Ownership#give()`

#### `Ownership#take()`

#### Utility Types

| `Ownership` namespace                 |
| ------------------------------------- |
| `Ownership.Options`                   |
| `Ownership.infer<T>`                  |
| `Ownership.inferTypes<T>`             |
| `Ownership.GenericBounds<G,RP,C,R,S>` |
| `Ownership.ParamsBounds<T>`           |
| `Ownership.MorphAssertion<T,R>`       |
| `Ownership.LeaveAssertion<T>`         |

[Scroll Up ↩](#table-of-contents)

### `borrow`

> **borrow**(`Ownership`): asserts ownership is `ConsumerOwnership`

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

> **release**(`Ownership`, _value_ | _setValue_, _payload_): asserts ownership is `never`

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

> **drop**(`Ownership`, _payload_): asserts ownership is `never`

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

> **take**(`Ownership`, receiver, receiverKey?): asserts ownership is `never`

**@summary**

Retrieves the captured value from the passed `Ownership`. \
After retrieval, the `Ownership` instance no longer contains a value and is of type `never`.

**@example**

```ts
const ownership = new Ownership<number>().capture(123 as const)
let _dst: number
take(ownership, (value) => (_dst = value))
// or
const dst: { current?: number } = {}
take(ownership, dst, 'current')
```

**@description**

The `take` function invalidates the `Ownership` parameter by narrowing it to `never`. \
For this reason, it is recommended to use it instead of `Ownership#take()`.

```ts
const _dst = ownership.take()
ownership // type `Ownership<...>`
// safe
const dst: { current?: number } = {}
take(ownership, dst, 'current')
ownership // type `never`
```

**@throws**

When `throwOnWrongState` setting is enabled (`true` by default), throws an 'Unable to take (not settled) ...' error \
if ownership of the value has not yet been returned as a result of sequential `give`, `borrow`, and `release/drop` calls.

This is due to internal tracking of the ownership/borrowing status.

```ts
const ownership = new Ownership<number>().capture(123 as number).give()
take(ownership, dst) // Error: Unable to take (not settled), call `release` or `drop` first or remove `give` call
```

Also throws 'Unable to take (already taken)' error when trying to call again on the same `Ownership` instance.

```ts
declare let ownership: ProviderOwnership<...>
take(ownership, dst)
take(ownership, dst) // Error: Unable to take (already taken)
```

[Scroll Up ↩](#table-of-contents)
