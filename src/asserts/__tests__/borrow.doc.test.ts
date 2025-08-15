import { borrow, Ownership, release } from 'borrowing'

/* eslint-disable @typescript-eslint/no-confusing-void-expression */

// file://./../borrow.ts
// file://./../../../README.md#borrow
// file://./../../../README.ru-RU.md#borrow
describe('borrow', () => {
  test('@example', () => {
    function _assert<T extends Ownership.GenericBounds<number>>(
      ownership: Ownership.ParamsBounds<T> | undefined,
    ): asserts ownership is Ownership.LeaveAssertion<T> {
      borrow(ownership)
      const value = ownership.captured

      expect(value).toBe(123)
    }
    const ownership = new Ownership<number>().capture(123).give()
    _assert(ownership)
  })
  {
    const value = 123
    test('@description', () => {
      const ownership = new Ownership<number>().give()
      expect(() => _assert(ownership)).toThrow('Unable to release (not borrowed), call `borrow` first')

      function _assert<T extends Ownership.GenericBounds<number>>(
        ownership: Ownership.ParamsBounds<T> | undefined,
      ): asserts ownership is Ownership.LeaveAssertion<T> {
        release(ownership, value)
      }
    })
  }
  test('@throws', () => {
    const ownership = new Ownership<number>()
    expect(() => _assert(ownership)).toThrow('Unable to borrow (not given), call `give` first')

    function _assert<T extends Ownership.GenericBounds<number>>(
      ownership: Ownership.ParamsBounds<T> | undefined,
    ): asserts ownership is Ownership.LeaveAssertion<T> {
      borrow(ownership)
    }
  })
})
