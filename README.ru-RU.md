<div align="center">

# <img src="header.svg" alt="borrowing" style="width: 100%; max-height: 180px">

[заимствование — англ.]

<p>
  <a href="https://www.npmjs.com/package/borrowing">
    <img alt="npm" src="https://img.shields.io/npm/v/borrowing">
  </a>
</p>

Позволяет передавать значения в функцию и получать наиболее точный тип значения  
далее по коду:

<ul align="left">

- либо измененный (Morphed)  
  `{value: 'open'}` >>> `{value: 'closed'}`
- либо неподконтрольный (Leaved)  
  `{value: 'closed'}` >>> `undefined`

</ul>

<p align="center">
  <a href="https://github.com/valooford/borrowing/stargazers">Поставить ⭐GitHub</a>
  |
  <a href="https://github.com/valooford/valooford#support">Поддержать автора</a>
</p>

---

</div>

[English](./README.md) | Русский

> [!IMPORTANT]
> **Важно**
>
> Эта версия `borrowing` находится в разработке. \
> Документация может быть неактуальна, в API могут (будут) появляться критические изменения. \
> Свежую бета-версию можно опробовать, установив ее следующим образом: \
> `npm install borrowing@next --save-exact`
>
> Документация текущей (latest) версии находится [здесь](https://github.com/valooford/borrowing).

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

▶ [Поэкспериментировать в TypeScript Playground](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgI2lCB3ANHAJusHAeQwDsBTKAZwAthC4pyAbcgQyvJxjYGty4AXzgAzdCDgByVFHQZgpAOaSAUCoQq4WuAHodcAMZswMAK5M4MGgIBubZqfKbtBiKSrww5UgeDM4ALxwFBhwJBTUdGAAPB5QCooAfAAUAJQAdEYm5uTJkoDw5JJwHIZuHqlq2rr6BkxsMAJspMVUnLDAbqKmPjAdzVb1KGiYVMWkuKXupiDko1a29o7OWiLdBr2dVnIAghhsAJ7RACpw5AAeDeOj4ZS09OkA4t6UwAYAQhDduFSxMPFKiRSyyqcEwETuYAAXGEyLcoukAApsKBsEBUD5fH5HRJwAA+cC+5BECnIuCwwNS0I4bRgozBcPocGA11hkXuABl2DZyNtWpQNqRjjiNCDtDI5Ml6WywBVRVp8BAwJLWRDZdpBJVtHo4GAmGBkQIpRDRNA4CAIDYEnBkopyPA2JYUe4RJQ2MhWIwiZRvAZyGqtKxPD6-AAlImBHXB5jpRTAblpTVabXm7mWayGYxmJgTOwOAQKGAQNMCVY9PrAraYXYHZJeHyhokVYHagzWAy8JkiYtwXOOJmjRRuJxVGD7LxwACSVAAouBRxGbtL0goXVAjmPZtFR14IF2675mGGRIkANqSADCmZyuEkAF1ThdvN8CeMiSSJgB+R196Eieycao4AAAz+RwgMTQC9XYGBoSyLMBHmHtFkacYM2YfwgNjeNUiA4pFDYBRgX3BsuyCYjozgnI8kKFpJnKGM41yf00x2PZ9lrKMj2Y7cBCnWcTH2bZ8IUBcVXhFdKHXLwfh43dI3rQ8iVPC8r2zO8H0uZ9CWJChP2-ARf3-ARtRAqAwJUDV1GbGpVJQiB5igJC8zGCYsPzeB4kUGh7TY4FXHceBUAgDsghCGFwSiaJJEAXg3AFWdyQUgySimDyOLJAyNyE2sww6gaMYWhpPoujLTYaEGJhWA4WZQTE+hgVLdYirqXBjg0p8WQi+4ngiV4MSuX5-iSIE5RqzqoXChkwERZFUXRT5+uxPEX1wN9dPJKpKQK-k6VqsB+wmpcAFloDAGheUKtxjhwI4z0vbI1NvYVgSqcVMGVMbmKqCr2E4d7JuYyyvvYXBkiC3gmyqbUeH4bte0NUx4DkxCgMXCFcIUDwml9Cs+FyMGcGSOHUkCJ6Rp4ycqDDSrOAmIJZK7OG2quKQ0rgL9QIM0QjMA0zzKqQQKkskUtX0NgDF9Exih1A5mAgNgJjkh0qC8XxiQMSwN2BQMhmCiMwtRyKYvipaYsANZ2ErSTJbNS+KMnOFWYCRfZZflqLFW8Ip8UkAxZZpi2MsYrLIZqXKUK29pOgagU00GXULWAFbRgdfVnbl3B6rWaPbRgABlHgGla85NI6ybHmeeJ3nm74BoSHBJHd0hPakH2ID9wFkme7QjSiaEDfuJEUTRPrq8W-FtPfdbtE26lttGyb9r7qbOTYblzv5PohUQTutFejA-ulT7tAVJVu-oHBT6m5LSUCAIgjNoov3rusimhb3fdJdLgUB7Rs7z+o8YgMFCGItPR-GAOQVMiEU4u3TlUY+oNAG8AJpjBoxMAikzlP5KgEBWDpFlooZIKC-SAV1AWUYb9W4fy-sArQ5NmQABECBeFphrHcXYwZM2fJIJo+wrAJAfvpOAhlmAARMhzcCwc4AADkiBHGnNCICFBuRQHRknVowBFCkDdB6QsYx9isK4HAbBBIAKIWYMAZAKIoD6JEq4EAyAFD1CKvIKw2UABEpAIAAFpuhUDYC6LxAAqNxXizKsFGGICAEgTw8SoLUegMAvGzHMaQGAt5kjeRgGAKgkI9CxPiSYJJVAUkwGXBAHQgsVBAA)

---

# Содержимое

- [Полезные ссылки](#полезные-ссылки)
- [Сниппеты для VS Code](#сниппеты-для-vs-code)
- [Справочник API](#справочник-api)
  - [`Ownership`](#ownership)
    - [`Ownership#options`](#ownershipoptions)
    - [`ConsumerOwnership#captured`](#consumerownershipcaptured)
    - [`Ownership#capture()`](#ownershipcapture)
    - [`Ownership#expectPayload()`](#ownershipexpectpayload)
    - [`Ownership#give()`](#ownershipgive)
    - [`Ownership#take()`](#ownershiptake)
    - [Вспомогательные типы](#вспомогательные-типы)
  - [`borrow`](#borrow)
  - [`release`](#release)
  - [`drop`](#drop)
  - [`take`](#take)
- [Ограничения и советы](#ограничения-и-советы)
- [Предыдущие версии](#предыдущие-версии)

## Полезные ссылки

- [Про assertion функции в TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) [ англ. ]
- [Can assertion functions provide a better experience for library users?](https://www.reddit.com/r/typescript/comments/1mw4kzr/can_assertion_functions_provide_a_better/) [ англ. ] \
  Пост на Reddit, демонстрирующий подходы к реализации механизмов заимствования на TypeScript. \
  (некоторые размышления в процессе разработки данной библиотеки)
- [BorrowScript](https://github.com/alshdavid/BorrowScript) (спецификация, на стадии проектирования) \
  _"TypeScript Синтаксис, Анализатор Заимствований Rust (borrow checker), Философия Go ... Без Сборщика Мусора"_

> [!TIP]
> **Совет**
>
> Используйте библиотеку в паре с правилами `no-unsafe-*` из [`typescript-eslint`](https://typescript-eslint.io/), такими как [`no-unsafe-call`](https://typescript-eslint.io/rules/no-unsafe-call/).  
> Это позволяет предотвратить дальнейшее использование экземпляра Ownership, как после вызова `take()`, так и после любого другого действия, приводящего к `never`.

## Сниппеты для VS Code

Добавьте приведенные сниппеты в [Global Snippets file](https://code.visualstudio.com/docs/editing/userdefinedsnippets#_create-your-own-snippets) (`Ctrl+Shift+P > Snippets: Configure Snippets`). \
В файлах со сниппетами для одного языка свойство `scope` можно убрать.

```jsonc
{
  "Создать экземпляр `Ownership`": {
    "scope": "typescript,typescriptreact",
    "prefix": "ownership",
    "body": ["new Ownership<${1:string}>().capture(${2:'hello'} as const).give();"],
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

### `Ownership`

> [**Ownership**](https://github.com/valooford/borrowing/blob/main/src/ownership/ownership.ts)([options?](#ownershipoptions)): `Ownership<General, Captured, State, ReleasePayload>`

**@summary**

Конструктор примитивов, определяющих владение над значением определенного типа. \
Общий (General) тип значения указывается в списке параметров дженерика.

**@example**

```ts
type Status = 'pending' | 'success' | 'error'
const ownership = new Ownership<Status>({ throwOnWrongState: false }) // тип `Ownership<Status, unknown, ...>`
```

**@description**

Является исходным и целевым типом assertion функций.

Вместе с assertion функциями реализует механизмы заимствования через видоизменение собственного типа. \
Тип экземпляра `Ownership` отражает как тип заимствованного в каждый момент времени значения,
так и состояние заимствования.

#### `Ownership#options`

**@summary**

Позволяет настраивать аспекты работы механизмов заимствования в рантайме. \
Доступны для чтения/записи прежде любого использования экземпляра `Ownership`.

| Настройка         | Тип       | Значение по умолчанию | Описание                                                                                                               |
| ----------------- | --------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| throwOnWrongState | `boolean` | `true`                | Включает выброс ошибок при неудавшейся смене состояния владения/заимствования через встроенные assertion функции.      |
| takenPlaceholder  | `any`     | `undefined`           | Переопределяет "пустое" значение для `Ownership`. Полезно, если тип захваченного значения включает в себя `undefined`. |

#### `ConsumerOwnership#captured`

**@summary**

Содержит заимствованное (captured) значение до момента, пока экземпляр `Ownership`
не будет обработан assertion функцией. \
Доступен внутри assertion функции. Во внешнем коде извлекается через функцию или метод `take()`.

**@example**

```ts
type Status = 'pending' | 'success' | 'error'
const ownership = new Ownership<Status>().capture('pending' as const)
const captured = ownership.captured // тип 'pending'

function _assert<T extends Ownership.GenericBounds<Status>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  borrow(ownership)
  const captured = ownership.captured // тип `Status`
}
```

[К содержимому ↩](#содержимое)

#### `Ownership#capture()`

**@summary**

Устанавливает значение, над которым определено владение. \
Рекомендуется использование литеральной формы значения в паре с утверждением `as const`.

**@example**

```ts
type Status = 'pending' | 'success' | 'error'
const ownership = new Ownership<Status>().capture('pending' as const) // тип `Ownership<Status, 'pending', ...>`
```

#### `Ownership#expectPayload()`

**@summary**

Определяет для экземпляра `Ownership` тип значения,
которое может быть передано assertion функцией в ходе ее выполнения.

Передача осуществляется в теле assertion функции
при вызове `release` (3-й аргумент) или `drop` (2-й аргумент). \
Переданное значение извлекается во внешнем коде
через функции `take` (2-й параметр колбэка) или `drop` (1-й параметр колбэка).

**@example**

```ts
const acceptExitCode = ownership.expectPayload<0 | 1>().give()
_assert(acceptExitCode)
drop(acceptExitCode, (payload) => {
  payload // 0
})
// эквивалентно `take(acceptExitCode, (_, payload) => { ... })`

function _assert<T extends Ownership.GenericBounds<number, 0 | 1>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  borrow(ownership)
  drop(ownership, 0) // эквивалентно `release(ownership, undefined, 0)`
}
```

[К содержимому ↩](#содержимое)

#### `Ownership#give()`

**@summary**

Подготавливает экземпляр `Ownership` к передаче внутрь assertion функции.

**@example**

```ts
const ownership = new Ownership<string>().capture('pending' as const)
const ownershipArg = ownership.give()
_assert(ownership)
ownership // тип `never`
_assert(ownershipArg)
ownershipArg // тип `ProviderOwnership<...>`

function _assert<T extends Ownership.GenericBounds<string>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.MorphAssertion<T, 'success'> {
  // (...)
}
```

#### `Ownership#take()`

**@summary**

Извлекает заимствованное (captured) значение. \
После извлечения экземпляр `Ownership` больше не содержит значения.

**@example**

```ts
type Status = 'pending' | 'success' | 'error'
const ownership = new Ownership<Status>().capture('pending' as const)
let _value = ownership.take() // 'pending'
_value = ownership.take() // undefined
```

**@description**

Метод `take` не инвалидирует экземпляр `Ownership`. \
По этой причине рекомендуется использование функции `take()`.

```ts
// небезопасно, т.к. `ownership` все еще доступен для использования (не приведен к `undefined` или `never`)
_morphedValue = ownership.take()

// безопасная альтернатива - приводит (asserts) `ownership` к `never`
take(ownership, (str) => void (_morphedValue = str))
```

[К содержимому ↩](#содержимое)

#### Вспомогательные типы

| Пространство имен `Ownership`                                                        | Описание                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Ownership.Options`                                                                  | Настройки механизмов заимствования в рантайме.                                                                                                                                                                                                     |
| `Ownership.inferTypes<T>`<br>└─`T extends Ownership`                                 | Типы параметров экземпляра по отдельности, например `inferTypes<typeof ownership>['Captured']`.                                                                                                                                                    |
| `Ownership.GenericBounds<G,RP>`<br>├─`G` - `General`<br>└─`RP` - `ReleasePayload`    | Для использования в списке параметров дженерик-типа assertion функции, чтобы произвести маппинг из типа фактически переданного экземпляра `Ownership`.<br>На выходе получается структура, удобная для использования в `*Assertion` дженерик-типах. |
| `Ownership.ParamsBounds<T>`<br>└─`T extends GenericBounds`                           | Для использования в качестве типа параметра assertion функции, принимающего экземпляр `Ownership`.<br>Внутрь передается дженерик параметр для успешного маппинга в `GenericBounds`.                                                                |
| `Ownership.MorphAssertion<T,R>`<br>├─`T extends GenericBounds`<br>└─`R` - `Released` | Целевой тип assertion функции, возвращающей `Ownership` с потенциально видоизмененным типом заимствованного (captured) значения.                                                                                                                   |
| `Ownership.LeaveAssertion<T>`<br>└─`T extends GenericBounds`                         | Целевой тип assertion функции, поглощающей заимствованное значение и инвалидирующей тип `Ownership`.                                                                                                                                               |

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

[К содержимому ↩](#содержимое)

### `borrow`

> [**borrow**](https://github.com/valooford/borrowing/blob/main/src/asserts/borrow.ts)(`Ownership`): asserts ownership is `ConsumerOwnership`

**@summary**

Уточняет (narrows) тип `Ownership` внутри assertion функции. \
Это позволяет получать доступ к заимствованному (captured) значению.

**@example**

```ts
function _assert<T extends Ownership.GenericBounds<number>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  borrow(ownership)
  const value = ownership.captured // тип `number`
}
```

**@description**

При включенной настройке `throwOnWrongState` (`true` по умолчанию) \
вызов функции `borrow` должен предшествовать вызову assertion функций `release` и `drop`.

Это связано с внутренним отслеживанием состояния владения/заимствования.

```ts
const ownership = new Ownership<number>().give()
_assert(ownership) // выбрасывает ошибку

function _assert<T extends Ownership.GenericBounds<number>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  release(ownership, value) // Ошибка: Unable to release (not borrowed), call `borrow` first
}
```

**@throws**

При включенной настройке `throwOnWrongState` (`true` по умолчанию) выбрасывает ошибку 'Unable to borrow ...' \
если перед этим не была вызвана функция `give`.

Это связано с внутренним отслеживанием состояния владения/заимствования.

```ts
const ownership = new Ownership<number>()
_assert(ownership) // выбрасывает ошибку

function _assert<T extends Ownership.GenericBounds<number>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  borrow(ownership) // Ошибка: Unable to borrow (not given), call `give` first
}
```

[К содержимому ↩](#содержимое)

### `release`

> [**release**](https://github.com/valooford/borrowing/blob/main/src/asserts/release.ts)(`Ownership`, _value_, _payload_): asserts ownership is `never`

**@summary**

Трансформирует заимствованное (captured) значение. \
Позволяет assertion функции возвращать результат (payload).

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

Функция `release` приводит переданный `Ownership` к `never` в теле самой assertion функции.

```ts
function _assert<T extends Ownership.GenericBounds>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.MorphAssertion<T, any> {
  borrow(ownership)
  release(ownership)
  ownership // тип `never`
}
```

**@throws**

При включенной настройке `throwOnWrongState` (`true` по умолчанию) выбрасывает ошибку \
'Unable to release ...' если перед этим не были поочередно вызваны функции `give` и `borrow`.

Это связано с внутренним отслеживанием состояния владения/заимствования.

```ts
const ownership = new Ownership<number>().capture(123 as const).give()
_assert(ownership) // выбрасывает ошибку

function _assert<T extends Ownership.GenericBounds>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.MorphAssertion<T, any> {
  release(ownership, value) // Ошибка: Unable to release (not borrowed), call `borrow` first
}
```

[К содержимому ↩](#содержимое)

### `drop`

> [**drop**](https://github.com/valooford/borrowing/blob/main/src/asserts/drop.ts)(`Ownership`, _payload_ | _receiver_): asserts ownership is `never`

**@summary**

Удаляет заимствованное (captured) значение. \
Позволяет assertion функции возвращать результат (payload), а внешнему коду - извлекать его.

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

Может использоваться как в теле assertion функции (`LeaveAssertion`)
вместо `release`, так и во внешнем коде вместо `take`. \
Избранное поведение определяется типом 2-го параметра -
извлечение значения, если это колбэк, и запись результата (payload) для остальных типов.

```ts
release(ownership, undefined, Result.Ok)
// эквивалентно
drop(_ownership, Result.Ok)

take(_ownership_, (_, _payload) => {})
// эквивалентно
drop(__ownership, (_payload) => {})
```

Функция `drop` приводит переданный `Ownership` к `never`. \
Может использоваться внутри assertion функции, которая
инвалидирует `Ownership` параметр, приводя его к `undefined`.

```ts
function _assert<T extends Ownership.GenericBounds<number>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is undefined {
  borrow(ownership)
  drop(ownership)
  ownership // тип `never`
}
```

**@throws**

При включенной настройке `throwOnWrongState` (`true` по умолчанию) выбрасывает ошибку 'Unable to release ...' \
если перед этим не были поочередно вызваны функции `give` и `borrow`.

Это связано с внутренним отслеживанием состояния владения/заимствования.

```ts
const ownership = new Ownership<number>().capture(123 as const).give()
_assert(ownership) // выбрасывает ошибку

function _assert<T extends Ownership.GenericBounds>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  // (...)
  drop(ownership) // Ошибка: Unable to release (not borrowed), call `borrow` first
}
```

[К содержимому ↩](#содержимое)

### `take`

> [**take**](https://github.com/valooford/borrowing/blob/main/src/asserts/take.ts)(`Ownership`, _receiver_): asserts ownership is `never`

**@summary**

Извлекает заимствованное значение из переданного `Ownership`. \
После извлечения экземпляр `Ownership` больше не содержит значения и имеет тип `never`.

Также позволяет извлечь результат (payload) assertion функции,
передавая его в колбэк вторым параметром.

**@example**

```ts
const ownership = new Ownership<number>().capture(123 as const)
let _dst: number
take(ownership, (value, _payload: unknown) => (_dst = value))
```

**@description**

Функция `take` инвалидирует `Ownership` параметр, приводя его к `never`. \
По этой причине она рекомендуется к использованию вместо `Ownership#take()`.

```ts
let _dst = ownership.take()
ownership // тип `Ownership<...>`
// безопасный вариант
take(ownership, (value) => (_dst = value))
ownership // тип `never`
```

**@throws**

При включенной настройке `throwOnWrongState` (`true` по умолчанию) выбрасывает ошибку 'Unable to take (not settled) ...' \
если владение над значением все еще не возвращено по результатам цепочки вызовов `give`, `borrow` и `release/drop`.

Это связано с внутренним отслеживанием состояния владения/заимствования.

```ts
const ownership = new Ownership<number>().capture(123 as const).give()
take(ownership, (value) => (_dst = value)) // Ошибка: Unable to take (not settled), call `release` or `drop` first or remove `give` call
```

Также выбрасывает ошибку 'Unable to take (already taken)' при попытке повторного вызова на том же экземпляре `Ownership`.

```ts
const ownership = new Ownership<number>().capture(123 as const)
take(ownership, (value) => (_dst = value))
take(ownership, (value) => (_dst = value)) // Ошибка: Unable to take (already taken)
```

[К содержимому ↩](#содержимое)

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
let ownership = new Ownership<State>({ throwOnWrongState: false }).capture({ value: 'open' } as const).give()
update(ownership, 'closed')
const v1 = ownership.take().value // тип 'closed'
update(ownership, 'open')
const v2 = ownership.take().value // тип 'closed' (не изменился)
type v2 = Ownership.inferTypes<typeof ownership>['Captured']['value'] // НЕПРАВИЛЬНЫЙ ТИП 'open' (то же и с `take` функцией)
ownership = ownership.give()
update(ownership, 'open')
const v3 = ownership.take().value // тип 'open'

function update<T extends Ownership.GenericBounds<State>, V extends 'open' | 'closed'>(
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
