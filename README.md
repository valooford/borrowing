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

const value = 'Hello, world!' // type 'Hello, world!'
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

▶ [See it in action](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgI2lCB3ANHAJusHAeQwDsBTKAZwAthC4pyAbcgQyvJxjYGty4AXzgAzdCDgByVFHQZgpAOaSAUCoQq4WuAHodcAMZswMAK5M4MGgIBubZqfKbtBiKSrww5UgeDM4ALxwFBhwJBTUdGAAPB5QCooAfAAUAJQAdEYm5uTJkoDw5JJwHIZuHqlq2rr6BkxsMAJspMVUnLDAbqKmPjAdzVb1KGiYVMWkuKXupiDko1a29o7OWiLdBr2dVnIAghhsAJ7RACpw5AAeDeOj4ZS09OkA4t6UwAYAQhDduFSxMPFKiRSyyqcEwETuYAAXGEyLcoukAApsKBsEBUD5fH5HRJwAA+cC+5BECnIuCwwNS0I4bRgozBcPocGA11hkXuABl2DZyNtWpQNqRjjiNCDtDI5Ml6WywBVRVp8BAwJLWRDZdpBJVtHo4GAmGBkQIpRDRNA4CAIDYEnBkopyPA2JYUe4RJQ2MhWIwiZRvAZyGqtKxPD6-AAlImBHXB5jpRTAblpTVabXm7mWayGYxmJgTOwOAQKGAQNMCVY9PrAraYXYHZJeHyhokVYHagzWAy8JkiYtwXOOJmjRRuJxVGD7LxwACSVAAouBRxGbtL0goXVAjmPZtFR14IF2675mGGRIkANqSADCmZyuEkAF1ThdvN8CeMiSSJgB+R196Eieycao4AAAz+RwgMTQC9XYGBoSyLMBHmHtFkacYM2YfwgNjeNUiA4pFDYBRgX3BsuyCYjozgnI8kKFpJnKGM41yf00x2PZ9lrKMj2Y7cBCnWcTH2bZ8IUBcVXhFdKHXLwfh43dI3rQ8iVPC8r2zO8H0uZ9CWJChP2-ARf3-ARtRAqAwJUDV1GbGpVJQiB5igJC8zGCYsPzeB4kUGh7TY4FXHceBUAgDsghCGFwSiaJJEAXg3AFWdyQUgySimDyOLJAyNyE2sww6gaMYWhpPoujLTYaEGJhWA4WZQTE+hgVLdYirqXBjg0p8WQi+4ngiV4MSuX5-iSIE5RqzqoXChkwERZFUXRT5+uxPEX1wN9dPJKpKQK-k6VqsB+wmpcAFloDAGheUKtxjhwI4z0vbI1NvYVgSqcVMGVMbmKqCr2E4d7JuYyyvvYXBkiC3gmyqbUeH4bte0NUx4DkxCgMXCFcIUDwml9Cs+FyMGcGSOHUkCJ6Rp4ycqDDSrOAmIJZK7OG2quKQ0rgL9QIM0QjMA0zzKqQQKkskUtX0NgDF9Exih1A5mAgNgJjkh0qC8XxiQMSwN2BQMhmCiMwtRyKYvipaYsANZ2ErSTJbNS+KMnOFWYCRfZZflqLFW8Ip8UkAxZZpi2MsYrLIZqXKUK29pOgagU00GXULWAFbRgdfVnbl3B6rWaPbRgABlHgGla85NI6ybHmeeJ3nm74BoSHBJHd0hPakH2ID9wFkme7QjSiaEDfuJEUTRPrq8W-FtPfdbtE26lttGyb9r7qbOTYblzv5PohUQTutFejA-ulT7tAVJVu-oHBT6m5LSUCAIgjNoov3rusimhb3fdJdLgUB7Rs7z+o8YgMFCGItPR-GAOQVMiEU4u3TlUY+oNAG8AJpjBoxMAikzlP5KgEBWDpFlooZIKC-SAV1AWUYb9W4fy-sArQ5NmQABECBeFphrHcXYwZM2fJIJo+wrAJAfvpOAhlmAARMhzcCwc4AADkiBHGnNCICFBuRQHRknVowBFCkDdB6QsYx9isK4HAbBBIAKIWYMAZAKIoD6JEq4EAyAFD1CKvIKw2UABEpAIAAFpuhUDYC6LxAAqNxXizKsFGGICAEgTw8SoLUegMAvGzHMaQGAt5kjeRgGAKgkI9CxPiSYJJVAUkwGXBAHQgsVBAA)

---

# Table of Contents

- [Resources](#resources)
- [VS Code Snippets](#vs-code-snippets)
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
- [Limitations and Recommendations](#limitations-and-recommendations)

## Resources

- [Assertion functions in TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)
- [Can assertion functions provide a better experience for library users?](https://www.reddit.com/r/typescript/comments/1mw4kzr/can_assertion_functions_provide_a_better/) \
  A Reddit post demonstrating approaches to implementing borrowing mechanisms in TypeScript. \
  (some thoughts on the development of this library)
- [BorrowScript](https://github.com/alshdavid/BorrowScript) (spec, design phase) \
  _"TypeScript Syntax, Rust Borrow Checker, Go Philosophies ... No Garbage Collection"_

> [!tip]
>
> Use in combination with `no-unsafe-*`-rules from [`typescript-eslint`](https://typescript-eslint.io/), such as [`no-unsafe-call`](https://typescript-eslint.io/rules/no-unsafe-call/).  
> This prevents further use of the Ownership instance, either after calling `take()` or after any other assertion that results in `never`.

## VS Code Snippets

Put this in your [Global Snippets file](https://code.visualstudio.com/docs/editing/userdefinedsnippets#_create-your-own-snippets) (`Ctrl+Shift+P > Snippets: Configure Snippets`). \
You can remove the `scope` property in single-language snippet files.

```jsonc
{
  "Create borrowing-ready `Ownership` instance": {
    "scope": "typescript,typescriptreact",
    "prefix": "ownership",
    "body": ["new Ownership<${1:string}>().capture(${2:'hello'} as const).give();"],
  },
  "Give settled `Ownership` again": {
    "scope": "typescript,typescriptreact",
    "prefix": "give",
    "body": [
      "${0:ownership} = ${0:ownership}.give();",
      // "$CLIPBOARD = $CLIPBOARD.give();"
    ],
  },
  "Create `MorphAssertion` function": {
    "scope": "typescript,typescriptreact",
    "prefix": "morph",
    "body": [
      "function ${1:assert}<T extends Ownership.GenericBounds<${2:string}>>(",
      "  ownership: Ownership.ParamsBounds<T> | undefined,",
      "): asserts ownership is Ownership.MorphAssertion<T, ${3:T['Captured']}> {",
      "  borrow(ownership);",
      "  $0",
      "  release(ownership, ${4:ownership.captured});",
      "}",
    ],
  },
  "Create `LeaveAssertion` function": {
    "scope": "typescript,typescriptreact",
    "prefix": "leave",
    "body": [
      "function ${1:assert}<T extends Ownership.GenericBounds<${2:string}>>(",
      "  ownership: Ownership.ParamsBounds<T> | undefined,",
      "): asserts ownership is Ownership.LeaveAssertion<T> {",
      "  borrow(ownership);",
      "  $0",
      "  drop(ownership$3);",
      "}",
    ],
  },
}
```

[Scroll Up ↩](#table-of-contents)

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

[Scroll Up ↩](#table-of-contents)

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

The payload is set in the body of the assertion function
when calling `release` (3rd argument) or `drop` (2nd argument). \
The passed value is retrieved in external code
via the `take` (2nd callback parameter) or `drop` (1st callback parameter) functions.

**@example**

```ts
const acceptExitCode = ownership.expectPayload<0 | 1>().give()
_assert(acceptExitCode)
drop(acceptExitCode, (payload) => {
  payload // 0
})
// same as `take(acceptExitCode, (_, payload) => { ... })`

function _assert<T extends Ownership.GenericBounds<number, 0 | 1>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  borrow(ownership)
  drop(ownership, 0) // same as `release(ownership, undefined, 0)`
}
```

[Scroll Up ↩](#table-of-contents)

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

> [**release**](https://github.com/valooford/borrowing/blob/main/src/asserts/release.ts)(`Ownership`, _value_, _payload_): asserts ownership is `never`

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
  release(ownership)
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

> [**drop**](https://github.com/valooford/borrowing/blob/main/src/asserts/drop.ts)(`Ownership`, _payload_ | _receiver_): asserts ownership is `never`

**@summary**

Garbages a captured value. \
Allows the assertion function to return a payload, and external code to retrieve it.

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

const ownership = new Ownership().expectPayload<Result>().give()
_assert(ownership)
drop(ownership, (payload) => {
  payload // Result.Ok
})
```

**@description**

Can be used both in the body of an assertion function (`LeaveAssertion`)
instead of `release`, and in external code instead of `take`. \
The selected behavior is determined by the type of the 2nd parameter -
extracting the value if it is a callback, and writing the payload for other types.

```ts
release(ownership, undefined, Result.Ok)
// same as
drop(_ownership, Result.Ok)

take(_ownership_, (_, _payload) => {})
// same as
drop(__ownership, (_payload) => {})
```

The `drop` function narrows the passed `Ownership` to `never`. \
Can be used inside an assertion function that
invalidates the `Ownership` parameter by narrowing it to `undefined`.

```ts
function _assert<T extends Ownership.GenericBounds<number>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is undefined {
  borrow(ownership)
  drop(ownership)
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
): asserts ownership is Ownership.LeaveAssertion<T> {
  // (...)
  drop(ownership) // Error: Unable to release (not borrowed), call `borrow` first
}
```

[Scroll Up ↩](#table-of-contents)

### `take`

> [**take**](https://github.com/valooford/borrowing/blob/main/src/asserts/take.ts)(`Ownership`, _receiver_): asserts ownership is `never`

**@summary**

Retrieves the captured value from the passed `Ownership`. \
After retrieval, the `Ownership` instance no longer contains a value and is of type `never`.

It also allows to extract the payload of the assertion function
by passing it to the callback as the second parameter.

**@example**

```ts
const ownership = new Ownership<number>().capture(123 as const)
let _dst: number
take(ownership, (value, _payload: unknown) => (_dst = value))
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

## Limitations and Recommendations

1. Always call the `borrow` and `release/drop` functions (in that order) in the body of assertion functions. \
   `: asserts ownership is Ownership.MorphAssertion { borrow + release }` \
   `: asserts ownership is Ownership.LeaveAssertion { borrow + ‎ drop ‎ ‎ }` \
   In the future, the presence of the necessary calls may be checked by the linter via a plugin (planned).

2. Don't forget to call the `give` method before passing the `Ownership` instance to the assertion function. \
   However, even if the call is invalid, the `take` method allows you to get
   the captured value with the last valid type.

```ts
interface State {
  value: string
}
let ownership = new Ownership<State>({ throwOnWrongState: false }).capture({ value: 'open' } as const).give()
update(ownership, 'closed')
const v1 = ownership.take().value // type 'closed'
update(ownership, 'open')
const v2 = ownership.take().value // type 'closed' (has not changed)
type v2 = Ownership.inferTypes<typeof ownership>['Captured']['value'] // WRONG TYPE 'open' (same with `take` function)
ownership = ownership.give()
update(ownership, 'open')
const v3 = ownership.take().value // type 'open'

function update<T extends Ownership.GenericBounds<State>, V extends 'open' | 'closed'>(
  ownership: Ownership.ParamsBounds<T> | undefined,
  value: V,
): asserts ownership is Ownership.MorphAssertion<T, { value: V }> {
  borrow(ownership)
  release(ownership, { value })
}
```

2.1. Unfortunately, the `take` function and the `Ownership.inferTypes` utility type still suffer from type changing. \
It is planned to reduce the risk of violating these rules by reworking the API
and implementing the previously mentioned functionality for the linter.

The above requirements are checked at runtime when the `throwOnWrongState` setting is enabled (`true` by default). \
In this case, their violation will result in an error being thrown.

3. Call `capture/give` immediately when creating an `Ownership` instance and assigning it to a variable. \
   This will prevent you from having other references to the value that may become invalid after assertion functions calls.

```ts
interface Field {
  value: string
}
declare function morph(/* ... */): void ... // some `MorphAssertion` function

// ❌ Incorrect
const field = { value: 'Hello' } as const
const fieldMutRef = new Ownership<Field>().capture(field).give()
morph(fieldMutRef)
drop(fieldMutRef)
fieldMutRef // type `never`
field.value = 'Still accessible'

// ❌ Incorrect
const fieldRef = new Ownership<Field>().capture({ value: 'Hello' } as const)
const fieldMutRef = fieldRef.give()
morph(fieldRef)
drop(fieldMutRef)
fieldMutRef // type `never`
fieldRef.take().value = 'Still accessible' // TypeError: Cannot read properties of undefined (reading 'value')

// ✅ Correct
let fieldMutRef = new Ownership<Field>().capture({ value: 'Hello' } as const).give()
morph(fieldMutRef)
fieldMutRef = fieldMutRef.give() // `let` allows ownership to be given multiple times using a single reference
morph(fieldMutRef)
take(fieldMutRef, (field) => {
  // (...)
})
fieldMutRef // type `never`
// there are no other references left
```

[Scroll Up ↩](#table-of-contents)
