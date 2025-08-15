import { borrow, drop, Ownership, release } from 'borrowing'

/* eslint-disable @typescript-eslint/no-unused-expressions */

// https://vitest.dev/guide/testing-types.html

//? copy the contents of each test without /* test */ blocks into the associated files (-> JSDoc -> README)

// file://./../drop.ts
// file://./../../../README.md#drop
// file://./../../../README.ru-RU.md#drop
describe('drop', () => {
  test('@example', () => {
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
  })
  describe('@description', () => {
    {
      const ownership = new Ownership<number>()
      enum Result {
        Ok,
        Err,
      }
      test('1st', () => {
        release(ownership, undefined, Result.Ok)
        // same as
        drop(ownership, Result.Ok)
      })
    }
    test('2nd', () => {
      function _assert<T extends Ownership.GenericBounds<number>>(
        ownership: Ownership.ParamsBounds<T> | undefined,
      ): asserts ownership is undefined {
        borrow(ownership)
        _assert(ownership)
        ownership // type `never`
        {
          /* test */
          expectTypeOf(ownership).toBeNever()
        }
      }
    })
  })
  test('@throws', () => {
    const ownership = new Ownership<number>().capture(123 as const).give()
    _assert(ownership) // throws

    function _assert<T extends Ownership.GenericBounds>(
      ownership: Ownership.ParamsBounds<T> | undefined,
    ): asserts ownership is Ownership.LeaveAssertion<T> {
      // (...)
      drop(ownership) // Error: Unable to drop (not borrowed), call `borrow` first
    }
  })
})
