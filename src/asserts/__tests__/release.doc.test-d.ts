import { borrow, Ownership, release } from 'borrowing'

/* eslint-disable @typescript-eslint/no-unused-expressions */

// https://vitest.dev/guide/testing-types.html

//? copy the contents of each test without /* test */ blocks into the associated files (-> JSDoc -> README)

// file://./../release.ts
// file://./../../../README.md#release
// file://./../../../README.ru-RU.md#release
describe('release', () => {
  test('@example', () => {
    type Status = 'open' | 'closed'
    enum Result {
      Ok,
      Err,
    }
    function _close<T extends Ownership.GenericBounds<Status, Result>>(
      ownership: Ownership.ParamsBounds<T> | undefined,
    ): asserts ownership is Ownership.MorphAssertion<T, 'closed'> {
      borrow(ownership)
      release(ownership, 'closed', Result.Ok)
    }
  })
  test('@description', () => {
    function _assert<T extends Ownership.GenericBounds>(
      ownership: Ownership.ParamsBounds<T> | undefined,
    ): asserts ownership is Ownership.MorphAssertion<T, any> {
      borrow(ownership)
      release(ownership, (prev) => prev)
      ownership // type `never`
      {
        /* test */
        expectTypeOf(ownership).toBeNever()
      }
    }
  })
  {
    const value = 123
    test('@throws', () => {
      const ownership = new Ownership<number>().capture(123 as const).give()
      _assert(ownership) // throws

      function _assert<T extends Ownership.GenericBounds>(
        ownership: Ownership.ParamsBounds<T> | undefined,
      ): asserts ownership is Ownership.MorphAssertion<T, any> {
        release(ownership, value) // Error: Unable to release (not borrowed), call `borrow` first
      }
    })
  }
})
