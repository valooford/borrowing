<div align="center">

# <img src="header.svg" alt="borrowing" style="width: 100%; max-height: 180px">

<p align="center">
  <a href="https://www.npmjs.com/package/borrowing">
    <img alt="npm" src="https://img.shields.io/npm/v/borrowing">
  </a>
</p>

Allows you to pass values to a function and get the most accurate value type\
in the following code:

<ul align="left">

- either Morphed one\
  `{value: 'open'}` >>> `{value: 'closed'}`
- or no longer under control (Leaved)\
  `{value: 'closed'}` >>> `undefined`

</ul>

<p align="center">
  <a href="https://github.com/valooford/borrowing/stargazers">Become a 🧙Stargazer</a>
  |
  <a href="https://github.com/valooford/valooford#support">Support the author</a>

  <hr>

### Warning 🚧

This version of `borrowing` is under development. \
Documentation may not be up to date, API may (will) have breaking changes. \
You can try out the fresh beta version by installing it as follows:

`npm install borrowing@next --save-exact`

New functionality is available at the `borrowing/next` entrypoint.

\*\*\*

The documentation for the current (latest) version is located [here](https://github.com/valooford/borrowing).

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
- [Limitations and Recommendations](#limitations-and-recommendations)
- [Previous versions](#previous-versions)

## Resources

- [Assertion functions in TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)
- [Can assertion functions provide a better experience for library users?](https://www.reddit.com/r/typescript/comments/1mw4kzr/can_assertion_functions_provide_a_better/) \
  A Reddit post demonstrating approaches to implementing borrowing mechanisms in TypeScript. \
  (some thoughts on the development of this library)
- [BorrowScript](https://github.com/alshdavid/BorrowScript) (spec, design phase) \
  _"TypeScript Syntax, Rust Borrow Checker, Go Philosophies ... No Garbage Collection"_

> \[!TIP]
>
> Use in combination with `no-unsafe-*`-rules from [`typescript-eslint`](https://typescript-eslint.io/), such as [`no-unsafe-call`](https://typescript-eslint.io/rules/no-unsafe-call/).\
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

### Variables

**`_WORK_IN_PROGRESS` variable**

Test

**Signature:**

```ts
_WORK_IN_PROGRESS: boolean
```

###### Beta

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

## Previous versions

- [v0.x](https://github.com/valooford/borrowing/tree/v/0.x)
