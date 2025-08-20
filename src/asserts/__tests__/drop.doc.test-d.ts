/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { borrow, drop, Ownership, release, take } from 'borrowing'

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

    const ownership = new Ownership().expectPayload<Result>().give()
    _assert(ownership)
    drop(ownership, (payload) => {
      payload // Result.Ok
      {
        /* test */
        expectTypeOf(payload).toEqualTypeOf<Result>()
      }
    })
    {
      /* test */
      expectTypeOf(ownership).toBeNever()
    }
  })
  describe('@description', () => {
    {
      const ownership = new Ownership<number>()
      const _ownership = new Ownership<number>()
      const _ownership_ = new Ownership<number>().expectPayload<'ok'>()
      const __ownership = new Ownership<number>().expectPayload<'ok'>()
      enum Result {
        Ok,
        Err,
      }
      test('1st', () => {
        release(ownership, undefined, Result.Ok)
        // same as
        drop(_ownership, Result.Ok)

        take(_ownership_, (_, _payload) => {})
        // same as
        drop(__ownership, (_payload) => {})
      })
    }
    test('2nd', () => {
      function _assert<T extends Ownership.GenericBounds<number>>(
        ownership: Ownership.ParamsBounds<T> | undefined,
      ): asserts ownership is undefined {
        borrow(ownership)
        drop(ownership)
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
      drop(ownership) // Error: Unable to release (not borrowed), call `borrow` first
    }
  })
})
