import { borrow, Ownership, release } from 'borrowing'

// https://vitest.dev/guide/testing-types.html

//? copy the contents of each test without /* test */ blocks into the associated files (-> JSDoc -> README)

// file://./../borrow.ts
// file://./../../../README.md#borrow
// file://./../../../README.ru-RU.md#borrow
describe('borrow', () => {
  test('@example', () => {
    function _assert<T extends Ownership.GenericBounds<number>>(
      ownership: Ownership.ParamsBounds<T> | undefined,
    ): asserts ownership is Ownership.LeaveAssertion<T> {
      borrow(ownership)
      const value = ownership.captured // type `number`
      {
        /* test */
        assertType<number>(value)
      }
    }
  })
  {
    const value = 123
    test('@description', () => {
      const ownership = new Ownership<number>().give()
      _assert(ownership) // throws

      function _assert<T extends Ownership.GenericBounds<number>>(
        ownership: Ownership.ParamsBounds<T> | undefined,
      ): asserts ownership is Ownership.LeaveAssertion<T> {
        release(ownership, value) // Error: Unable to release (not borrowed), call `borrow` first
      }
    })
  }
  test('@throws', () => {
    const ownership = new Ownership<number>()
    _assert(ownership) // throws

    function _assert<T extends Ownership.GenericBounds<number>>(
      ownership: Ownership.ParamsBounds<T> | undefined,
    ): asserts ownership is Ownership.LeaveAssertion<T> {
      borrow(ownership) // Error: Unable to borrow (not given), call `give` first
    }
  })
})
