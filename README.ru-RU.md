<div align="center">

# <img src="header.svg" alt="borrowing" style="width: 100%; max-height: 180px">

\[заимствование — англ.]

<p>
  <a href="https://www.npmjs.com/package/borrowing">
    <img alt="npm" src="https://img.shields.io/npm/v/borrowing">
  </a>
</p>

Позволяет передавать значения в функцию и получать наиболее точный тип значения\
далее по коду:

<ul align="left">

- либо измененный (Morphed)\
  `{value: 'open'}` >>> `{value: 'closed'}`
- либо неподконтрольный (Leaved)\
  `{value: 'closed'}` >>> `undefined`

</ul>

<p align="center">
  <a href="https://github.com/valooford/borrowing/stargazers">Поставить ⭐GitHub</a>
  |
  <a href="https://github.com/valooford/valooford#support">Поддержать автора</a>

  <hr>

### Внимание 🚧

Эта версия `borrowing` находится в разработке. \
Документация может быть неактуальна, в API могут (будут) появляться критические изменения. \
Свежую бета-версию можно опробовать, установив ее следующим образом:

`npm install borrowing@next --save-exact`

Новый функционал доступен под `borrowing/next`

\*\*\*

Документация текущей (latest) версии находится [здесь](https://github.com/valooford/borrowing).

</p>

---

</div>

[English](./README.md) | Русский

## Пример

```ts
import { Ownership } from 'borrowing'

import { replaceStr, sendMessage } from './lib'

const value = 'Привет, мир!' // тип 'Привет, мир!'
let ownership = new Ownership<string>().capture(value).give()
replaceStr(ownership, 'ИЗМЕН4И8ЫЙ МNР')
let morphedValue = ownership.take() // новый тип 'ИЗМЕН4И8ЫЙ МNР' | (*)

ownership // тип `Ownership<string, 'ИЗМЕН4И8ЫЙ МNР', ...>`
ownership = ownership.give()
sendMessage(ownership)
ownership // новый тип `undefined`
```

Реализация функций (assertion fuctions):

```ts
// lib.ts
import { borrow, drop, Ownership, release } from 'borrowing'

export function replaceStr<
  V extends string,
  T extends Ownership.GenericBounds<string>,
>(
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

▶ [Поэкспериментировать в TypeScript Playground](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgI2lCB3ANHAJusHAeQwDsBTKAZwAthC4pyAbcgQyvJxjYGty4AXzgAzdCDgByVFHQZgpAOaSAUCoQq4WuAHodcAMZswMAK5M4MGgIBubZqfKbtBiKSrww5UgeDM4ALxwFBhwJBTUdGAAPB5QCooAfAAUAJQAdEYm5uTJkoDw5JJwHIZuHqlq2rr6BkxsMAJspMVUnLDAbqKmPjAdzVb1KGiYVMWkuKXupiDko1a29o7OWiLdBr2dVnIAghhsAJ7RACpw5AAeDeOj4ZS09OkA4t6UwAYAQhDduFSxMPFKiRSyyqcEwETuYAAXGEyLcoukAApsKBsEBUD5fH5HRJwAA+cC+5BECnIuCwwNS0I4bRgozBcPocGA11hkXuABl2DZyNtWpQNqRjjiNCDtDI5Ml6WywBVRVp8BAwJLWRDZdpBJVtHo4GAmGBkQIpRDRNA4CAIDYEnBkopyPA2JYUe4RJQ2MhWIwiZRvAZyGqtKxPD6-AAlImBHXB5jpRTAblpTVabXm7mWayGYxmJgTOwOAQKGAQNMCVY9PrAraYXYHZJeHyhokVYHagzWAy8JkiYtwXOOJmjRRuJxVGD7LxwACSVAAouBRxGbtL0goXVAjmPZtFR14IF2675mGGRIkANqSADCmZyuEkAF1ThdvN8CeMiSSJgB+R196Eieycao4AAAz+RwgMTQC9XYGBoSyLMBHmHtFkacYM2YfwgNjeNUiA4pFDYBRgX3BsuyCYjozgnI8kKFpJnKGM41yf00x2PZ9lrKMj2Y7cBCnWcTH2bZ8IUBcVXhFdKHXLwfh43dI3rQ8iVPC8r2zO8H0uZ9CWJChP2-ARf3-ARtRAqAwJUDV1GbGpVJQiB5igJC8zGCYsPzeB4kUGh7TY4FXHceBUAgDsghCGFwSiaJJEAXg3AFWdyQUgySimDyOLJAyNyE2sww6gaMYWhpPoujLTYaEGJhWA4WZQTE+hgVLdYirqXBjg0p8WQi+4ngiV4MSuX5-iSIE5RqzqoXChkwERZFUXRT5+uxPEX1wN9dPJKpKQK-k6VqsB+wmpcAFloDAGheUKtxjhwI4z0vbI1NvYVgSqcVMGVMbmKqCr2E4d7JuYyyvvYXBkiC3gmyqbUeH4bte0NUx4DkxCgMXCFcIUDwml9Cs+FyMGcGSOHUkCJ6Rp4ycqDDSrOAmIJZK7OG2quKQ0rgL9QIM0QjMA0zzKqQQKkskUtX0NgDF9Exih1A5mAgNgJjkh0qC8XxiQMSwN2BQMhmCiMwtRyKYvipaYsANZ2ErSTJbNS+KMnOFWYCRfZZflqLFW8Ip8UkAxZZpi2MsYrLIZqXKUK29pOgagU00GXULWAFbRgdfVnbl3B6rWaPbRgABlHgGla85NI6ybHmeeJ3nm74BoSHBJHd0hPakH2ID9wFkme7QjSiaEDfuJEUTRPrq8W-FtPfdbtE26lttGyb9r7qbOTYblzv5PohUQTutFejA-ulT7tAVJVu-oHBT6m5LSUCAIgjNoov3rusimhb3fdJdLgUB7Rs7z+o8YgMFCGItPR-GAOQVMiEU4u3TlUY+oNAG8AJpjBoxMAikzlP5KgEBWDpFlooZIKC-SAV1AWUYb9W4fy-sArQ5NmQABECBeFphrHcXYwZM2fJIJo+wrAJAfvpOAhlmAARMhzcCwc4AADkiBHGnNCICFBuRQHRknVowBFCkDdB6QsYx9isK4HAbBBIAKIWYMAZAKIoD6JEq4EAyAFD1CKvIKw2UABEpAIAAFpuhUDYC6LxAAqNxXizKsFGGICAEgTw8SoLUegMAvGzHMaQGAt5kjeRgGAKgkI9CxPiSYJJVAUkwGXBAHQgsVBAA)

---

# Содержимое

- [Полезные ссылки](#полезные-ссылки)
- [Сниппеты для VS Code](#сниппеты-для-vs-code)
- [Справочник API](#справочник-api)
- [Ограничения и советы](#ограничения-и-советы)
- [Предыдущие версии](#предыдущие-версии)

## Полезные ссылки

- [Про assertion функции в TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) \[ англ. ]
- [Can assertion functions provide a better experience for library users?](https://www.reddit.com/r/typescript/comments/1mw4kzr/can_assertion_functions_provide_a_better/) \[ англ. ] \
  Пост на Reddit, демонстрирующий подходы к реализации механизмов заимствования на TypeScript. \
  (некоторые размышления в процессе разработки данной библиотеки)
- [BorrowScript](https://github.com/alshdavid/BorrowScript) (спецификация, на стадии проектирования) \
  _"TypeScript Синтаксис, Анализатор Заимствований Rust (borrow checker), Философия Go ... Без Сборщика Мусора"_

> \[!TIP]
> **Совет**
>
> Используйте библиотеку в паре с правилами `no-unsafe-*` из [`typescript-eslint`](https://typescript-eslint.io/), такими как [`no-unsafe-call`](https://typescript-eslint.io/rules/no-unsafe-call/).\
> Это позволяет предотвратить дальнейшее использование экземпляра Ownership, как после вызова `take()`, так и после любого другого действия, приводящего к `never`.

## Сниппеты для VS Code

Добавьте приведенные сниппеты в [Global Snippets file](https://code.visualstudio.com/docs/editing/userdefinedsnippets#_create-your-own-snippets) (`Ctrl+Shift+P > Snippets: Configure Snippets`). \
В файлах со сниппетами для одного языка свойство `scope` можно убрать.

```jsonc
{
  "Создать экземпляр `Ownership`": {
    "scope": "typescript,typescriptreact",
    "prefix": "ownership",
    "body": [
      "new Ownership<${1:string}>().capture(${2:'hello'} as const).give();",
    ],
  },
  "Повторно передать владение над `Ownership`": {
    "scope": "typescript,typescriptreact",
    "prefix": "give",
    "body": [
      "${0:ownership} = ${0:ownership}.give();",
      // "$CLIPBOARD = $CLIPBOARD.give();"
    ],
  },
  "Создать `MorphAssertion` функцию": {
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
  "Создать `LeaveAssertion` функцию": {
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

[К содержимому ↩](#содержимое)

## Справочник API

### Functions

#### `borrow()` function

**Signature:**

```ts
declare function borrow<T, C extends T = T>(
  cell: RefCell<T, C>,
): asserts cell is Borrow<T, C>
```

#### `borrowMut()` function

**Signature:**

```ts
declare function borrowMut<T>(
  cell: RefCellMut<T, T>,
): asserts cell is BorrowMut<T, T>
```

#### `mut()` function

**Signature:**

```ts
mut: <T>(v: T) => Mut<T>
```

###### Public

#### `scope()` function

**Signature:**

```ts
scope: <Move extends RefCellBase[]>(...args: [...Move, ScopeBlock<Move>]) => void
```

###### Public

### Variables

**`_WORK_IN_PROGRESS` variable**

Test

**Signature:**

```ts
_WORK_IN_PROGRESS: boolean
```

###### Beta

### Type Aliases

**`Borrow` type**

**Signature:**

```ts
type Borrow<T = unknown, C extends T = T> = Ref<T, C> & {
  take(): RefCell<T, C>
}
```

**`BorrowMut` type**

**Signature:**

```ts
type BorrowMut<T = unknown, C extends T = T> = RefMut<T, C> & {
  take(): RefCellMut<T, C>
}
```

**`Ref` type**

**Signature:**

```ts
type Ref<T = unknown, C extends T = T> = RefCell<T, C> & {
  deref(): C
}
```

**`RefCell` type**

**Signature:**

```ts
type RefCell<T = any, C extends T = T> = RefCellBase<T, C> &
  UnionToIntersection<Traits<T, C, DerivedTraits<C>>>
```

**`RefCellMut` type**

**Signature:**

```ts
type RefCellMut<T = any, C extends T = T> = RefCellMutBase<T, C> &
  UnionToIntersection<Traits<T, C, DerivedTraits<C>>>
```

**`RefMut` type**

**Signature:**

```ts
type RefMut<T = unknown, C extends T = T> = RefCellMut<T, C> & {
  deref(): C
}
```

## Ограничения и советы

1. Всегда вызывайте функции `borrow` и `release/drop` (в таком порядке) в теле assertion функций. \
   `: asserts ownership is Ownership.MorphAssertion { borrow + release }` \
   `: asserts ownership is Ownership.LeaveAssertion { borrow + ‎ drop ‎ ‎ }` \
   В будущем наличие необходимых вызовов может проверяться линтером через плагин (запланирован).

2. Не забывайте про вызов метода `give` перед передачей экземпляра `Ownership` в assertion функцию. \
   Однако даже при невалидном вызове метод `take` позволяет получить
   заимствованное (captured) значение с последним валидным типом.

```ts
interface State {
  value: string
}
let ownership = new Ownership<State>({ throwOnWrongState: false })
  .capture({ value: 'open' } as const)
  .give()
update(ownership, 'closed')
const v1 = ownership.take().value // тип 'closed'
update(ownership, 'open')
const v2 = ownership.take().value // тип 'closed' (не изменился)
type v2 = Ownership.inferTypes<typeof ownership>['Captured']['value'] // НЕПРАВИЛЬНЫЙ ТИП 'open' (то же и с `take` функцией)
ownership = ownership.give()
update(ownership, 'open')
const v3 = ownership.take().value // тип 'open'

function update<
  T extends Ownership.GenericBounds<State>,
  V extends 'open' | 'closed',
>(
  ownership: Ownership.ParamsBounds<T> | undefined,
  value: V,
): asserts ownership is Ownership.MorphAssertion<T, { value: V }> {
  borrow(ownership)
  release(ownership, { value })
}
```

2.1. К сожалению, функция `take` и вспомогательный тип `Ownership.inferTypes` все еще страдают от изменения типа. \
Планируется снизить риск нарушения этих правил путем переработки API
и реализации ранее упомянутого функционала для линтера.

Вышеприведенные требования проверяются в рантайме при включенной настройке `throwOnWrongState` (`true` по умолчанию). \
В этом случае их нарушение приведет к выбросу ошибки.

3. Вызывайте `capture/give` тут же при создании экземпляра `Ownership` и присваивании его переменной. \
   Это позволит не иметь других ссылок на значение, которые могут стать невалидными после вызовов assertion функций.

```ts
interface Field {
  value: string
}
declare function morph(/* ... */): void ... // некоторая `MorphAssertion` функция

// ❌ Неправильно
const field = { value: 'Hello' } as const
const fieldMutRef = new Ownership<Field>().capture(field).give()
morph(fieldMutRef)
drop(fieldMutRef)
fieldMutRef // тип `never`
field.value = 'Still accessible'

// ❌ Неправильно
const fieldRef = new Ownership<Field>().capture({ value: 'Hello' } as const)
const fieldMutRef = fieldRef.give()
morph(fieldRef)
drop(fieldMutRef)
fieldMutRef // тип `never`
fieldRef.take().value = 'Still accessible' // Ошибка (TypeError): Cannot read properties of undefined (reading 'value')

// ✅ Правильно
let fieldMutRef = new Ownership<Field>().capture({ value: 'Hello' } as const).give()
morph(fieldMutRef)
fieldMutRef = fieldMutRef.give() // `let` позволяет передавать владение несколько раз, используя ссылку, хранящуюся в единственной переменной
morph(fieldMutRef)
take(fieldMutRef, (field) => {
  // (...)
})
fieldMutRef // тип `never`
// не остается других ссылок на значение
```

[К содержимому ↩](#содержимое)

## Предыдущие версии

- [v0.x](https://github.com/valooford/borrowing/tree/v/0.x)
