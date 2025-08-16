<div align="center">

# <img src="header.svg" alt="borrowing" style="width: 100%; max-height: 180px">

[заимствование — англ.]

<p>
  <a href="https://www.npmjs.com/package/borrowing" >
    <img alt="npm" src="https://img.shields.io/npm/v/borrowing">
  </a>
</p>

Позволяет передавать значения в функцию и получать наиболее точный тип значения  
далее по коду:

<ul align="left">

- либо измененный (Morphed)  
  `{value: 'open'}` 🡢 `{value: 'closed'}`
- либо неподконтрольный (Leaved)  
  `{value: 'closed'}` 🡢 `undefined`

</ul>

<hr/><br/>
</div>

[English](./README.md) | Русский

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

---

# Содержимое

- [Полезные ссылки](#полезные-ссылки)
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

## Полезные ссылки

- [Про assertion функции в TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) [ англ. ]

> [!tip]
> **Совет**
>
> Используйте библиотеку в паре с правилами `no-unsafe-*` из [`typescript-eslint`](https://typescript-eslint.io/), такими как [`no-unsafe-call`](https://typescript-eslint.io/rules/no-unsafe-call/).  
> Это позволяет предотвратить дальнейшее использование экземпляра Ownership, как после вызова `take()`, так и после любого другого действия, приводящего к `never`.

## Справочник API

### `Ownership`

> [**Ownership**](https://github.com/valooford/borrowing/blob/main/src/ownership/ownership.ts)([options?](#ownershipoptions)): `Ownership<General, Captured, Released, State, ReleasePayload>`

**@summary**

Конструктор примитивов, определяющих владение над значением определенного типа. \
Общий (General) тип значения указывается в списке параметров дженерика.

**@description**

Является исходным и целевым типом assertion функций.

Вместе с assertion функциями реализует механизмы заимствования через видоизменение собственного типа. \
Тип экземпляра `Ownership` отражает как тип заимствованного в каждый момент времени значения,
так и состояние заимствования.

#### `Ownership#options`

**@summary**

Позволяет настраивать аспекты работы механизмов заимствования в рантайме. \
Доступны для чтения/записи прежде любого использования экземпляра `Ownership`.

| Настройка         | Тип       | Значение по умолчанию | Описание                                                                                                          |
| ----------------- | --------- | --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| throwOnWrongState | `boolean` | `true`                | Включает выброс ошибок при неудавшейся смене состояния владения/заимствования через встроенные assertion функции. |

#### `ConsumerOwnership#captured`

**@summary**

Содержит заимствованное (captured) значение до момента, пока экземпляр `Ownership`
не будет обработан assertion функцией. \
Доступен внутри assertion функции. Во внешнем коде извлекается через функцию или метод `take()`.

#### `Ownership#capture()`

**@summary**

Устанавливает значение, над которым определено владение. \
Рекомендуется использование литеральной формы значения в паре с утверждением `as const`.

#### `Ownership#expectPayload()`

**@summary**

Определяет для экземпляра `Ownership` тип значения,
которое может быть передано assertion функцией в ходе ее выполнения.

#### `Ownership#give()`

**@summary**

Подготавливает экземпляр `Ownership` к передаче внутрь assertion функции.

#### `Ownership#take()`

**@summary**

Извлекает заимствованное (captured) значение. \
После извлечения экземпляр `Ownership` больше не содержит значения.

**@description**

Метод `take` не инвалидирует экземпляр `Ownership`. \
По этой причине рекомендуется использование функции `take()`.

```ts
import { take } from 'borrowing'

// небезопасно, т.к. `ownership` все еще доступен для использования (не приведен к `undefined` или `never`)
let morphedValue = ownership.take()

// безопасная альтернатива - приводит (asserts) `ownership` к `never`
take(ownership, (str) => (morphedValue = str))
```

#### Вспомогательные типы

| Пространство имен `Ownership`                     | Описание                                                                                                                                                                                                                                           |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Ownership.Options`                               | Настройки механизмов заимствования в рантайме.                                                                                                                                                                                                     |
| `Ownership.inferTypes<T>`                         | Типы параметров экземпляра по отдельности, например `inferTypes<typeof ownership>['Captured']`.                                                                                                                                                    |
| `Ownership.GenericBounds<General,ReleasePayload>` | Для использования в списке параметров дженерик-типа assertion функции, чтобы произвести маппинг из типа фактически переданного экземпляра `Ownership`.<br>На выходе получается структура, удобная для использования в `*Assertion` дженерик-типах. |
| `Ownership.ParamsBounds<GenericBounds>`           | Для использования в качестве типа параметра assertion функции, принимающего экземпляр `Ownership`.<br>Внутрь передается дженерик параметр для успешного маппинга в `GenericBounds`.                                                                |
| `Ownership.MorphAssertion<GenericBounds,Release>` | Целевой тип assertion функции, возвращающей `Ownership` с потенциально видоизмененным типом заимствованного (captured) значения.                                                                                                                   |
| `Ownership.LeaveAssertion<GenericBounds>`         | Целевой тип assertion функции, поглощающей заимствованное значение и инвалидирующей тип `Ownership`.                                                                                                                                               |

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

> [**release**](https://github.com/valooford/borrowing/blob/main/src/asserts/release.ts)(`Ownership`, _value_ | _setValue_, _payload_): asserts ownership is `never`

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
  release(ownership, (prev) => prev)
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

> [**drop**](https://github.com/valooford/borrowing/blob/main/src/asserts/drop.ts)(`Ownership`, _payload_): asserts ownership is `never`

**@summary**

Удаляет заимствованное (captured) значение. \
Позволяет assertion функции возвращать результат (payload).

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

Является сокращенной формой функции `release`, сбрасывающей заимствованное значение в `undefined`.

```ts
release(ownership, undefined, Result.Ok)
// эквивалентно
drop(ownership, Result.Ok)
```

Функция `drop` приводит переданный `Ownership` к `never` в теле самой assertion функции. \
Может использоваться внутри assertion функции, которая
инвалидирует `Ownership` параметр, приводя его к `undefined`.

```ts
function _assert<T extends Ownership.GenericBounds<number>>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is undefined {
  borrow(ownership)
  _assert(ownership)
  ownership // тип `never`
}
```

**@throws**

При включенной настройке `throwOnWrongState` (`true` по умолчанию) выбрасывает ошибку 'Unable to drop ...' \
если перед этим не были поочередно вызваны функции `give` и `borrow`.

Это связано с внутренним отслеживанием состояния владения/заимствования.

```ts
const ownership = new Ownership<number>().capture(123 as const).give()
_assert(ownership) // выбрасывает ошибку

function _assert<T extends Ownership.GenericBounds>(
  ownership: Ownership.ParamsBounds<T> | undefined,
): asserts ownership is Ownership.LeaveAssertion<T> {
  // (...)
  drop(ownership) // Ошибка: Unable to drop (not borrowed), call `borrow` first
}
```

[К содержимому ↩](#содержимое)

### `take`

> [**take**](https://github.com/valooford/borrowing/blob/main/src/asserts/take.ts)(`Ownership`, receiver, receiverKey?): asserts ownership is `never`

**@summary**

Извлекает заимствованное значение из переданного `Ownership`. \
После извлечения экземпляр `Ownership` больше не содержит значения и имеет тип `never`.

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

Функция `take` инвалидирует `Ownership` параметр, приводя его к `never`. \
По этой причине она рекомендуется к использованию вместо `Ownership#take()`.

```ts
const _dst = ownership.take()
ownership // тип `Ownership<...>`
// безопасный вариант
const dst: { current?: number } = {}
take(ownership, dst, 'current')
ownership // тип `never`
```

**@throws**

При включенной настройке `throwOnWrongState` (`true` по умолчанию) выбрасывает ошибку 'Unable to take (not settled) ...' \
если владение над значением все еще не возвращено по результатам цепочки вызовов `give`, `borrow` и `release/drop`.

Это связано с внутренним отслеживанием состояния владения/заимствования.

```ts
const ownership = new Ownership<number>().capture(123 as number).give()
take(ownership, dst) // Ошибка: Unable to take (not settled), call `release` or `drop` first or remove `give` call
```

Также выбрасывает ошибку 'Unable to take (already taken)' при попытке повторного вызова на том же экземпляре `Ownership`.

```ts
declare let ownership: ProviderOwnership<...>
take(ownership, dst)
take(ownership, dst) // Ошибка: Unable to take (already taken)
```

[К содержимому ↩](#содержимое)
