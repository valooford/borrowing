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

You can find more examples in the test files:

- [index.test-d.ts](https://github.com/valooford/borrowing/blob/main/tests/index.test-d.ts)
- [index.test.ts](https://github.com/valooford/borrowing/blob/main/tests/index.test.ts)

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
