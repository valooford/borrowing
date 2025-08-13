<div align="center">

# borrowing

[заимствование — англ.]

<p>
  <a href="https://www.npmjs.com/package/borrowing" >
    <img alt="npm" src="https://img.shields.io/npm/v/borrowing">
  </a>
</p>

Позволяет передавать значения в функцию и получать наиболее точный тип значения далее по коду:

<ul align="left">

- либо измененный (Morphed)  
  `{value: 'open'}` 🡢 `{value: 'closed'}`
- либо неподконтрольный (Leaved)  
  `{value: 'closed'}` 🡢 `undefined`

</ul>

<hr/><br/>
</div>

<div align="right">

[English](./README.md) | Русский

</div>

## Пример

```ts
import { Ownership } from 'borrowing'

import { replaceStr, sendMessage } from './lib'

const value = 'Привет, мир!' as const // тип 'Привет, мир!'
let ownership = new Ownership<string>().capture(value).give()
replaceStr(ownership, 'ИЗМЕН4И8ЫЙ МNР')
let morphedValue = ownership.take() // новый тип 'ИЗМЕН4И8ЫЙ МNР' | (*)

ownership // тип `Ownership<string, undefined, 'ИЗМЕН4И8ЫЙ МNР', ...>`
ownership = ownership.give()
sendMessage(ownership)
ownership // новый тип `undefined`
```

Реализация функций (assertion fuctions):

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
  const value = ownership.captured // тип `string`
  fetch('https://web.site/api/log', { method: 'POST', body: value })
  drop(ownership)
}
```

Другие примеры использования можно найти в файлах с тестами:

- [index.test-d.ts](https://github.com/valooford/borrowing/blob/main/tests/index.test-d.ts)
- [index.test.ts](https://github.com/valooford/borrowing/blob/main/tests/index.test.ts)

---

(\*) - Использование функции `take()` предпочтительнее `Ownership#take()`

```ts
import { take } from 'borrowing'

// небезопасно, т.к. `ownership` все еще доступен для использования (не приведен к `undefined` или `never`)
let morphedValue = ownership.take()

// безопасная альтернатива - приводит (asserts) `ownership` к `never`
take(ownership, (str) => (morphedValue = str))
```

> [!tip] Совет
>
> Используйте в паре с правилами `no-unsafe-*` из [`typescript-eslint`](https://typescript-eslint.io/), такими как [`no-unsafe-call`](https://typescript-eslint.io/rules/no-unsafe-call/).  
> Это позволяет предотвратить дальнейшее использование экземпляра Ownership, как после вызова `take()`, так и после любого другого действия, приводящего к `never`.
