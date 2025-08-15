import { borrow, drop, Ownership, release } from 'borrowing'

/* eslint-disable @typescript-eslint/no-confusing-void-expression */

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
    const ownership = new Ownership().capture(123).expectPayload<Result>().give()
    _assert(ownership)
    expect(ownership.take()).toBeUndefined()
    // TODO: check payload as well
  })
  describe('@description', () => {
    test('1st', () => {
      enum Result {
        Ok,
        Err,
      }
      function _assert<T extends Ownership.GenericBounds<any, Result>>(
        ownership: Ownership.ParamsBounds<T> | undefined,
      ): asserts ownership is Ownership.LeaveAssertion<T> {
        borrow(ownership)
        release(ownership, undefined, Result.Ok)
      }
      const ownership = new Ownership().capture(123).expectPayload<Result>().give()
      _assert(ownership)
      expect(ownership.take()).toBeUndefined()
      // TODO: check payload as well
    })
    {
      test('2nd', () => {
        function _assert<T extends Ownership.GenericBounds<number>>(
          ownership: Ownership.ParamsBounds<T> | undefined,
        ): asserts ownership is undefined {
          borrow(ownership)
          drop(ownership)
          drop(ownership)
        }
        const ownership = new Ownership<number>().give()
        expect(() => _assert(ownership)).toThrow('Unable to drop (already settled), call `give` first')
      })
    }
  })
  test('@throws', () => {
    const ownership = new Ownership<number>().capture(123 as const).give()
    expect(() => _assert(ownership)).toThrow('Unable to drop (not borrowed), call `borrow` first')

    function _assert<T extends Ownership.GenericBounds>(
      ownership: Ownership.ParamsBounds<T> | undefined,
    ): asserts ownership is undefined {
      drop(ownership)
    }
  })
})
