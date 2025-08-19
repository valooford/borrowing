/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { borrow, Ownership, release, take } from 'borrowing'

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
    const ownership = new Ownership<Status>().capture('open').expectPayload<Result>().give()
    _close(ownership)
    take(ownership, (value, payload) => {
      expect(value).toBe('closed')
      expect(payload).toBe(Result.Ok)
    })
  })
  test('@description', () => {
    function _assert<T extends Ownership.GenericBounds>(
      ownership: Ownership.ParamsBounds<T> | undefined,
    ): asserts ownership is Ownership.MorphAssertion<T, any> {
      borrow(ownership)
      release(ownership, (prev) => prev)
      release(ownership, (prev) => prev)
    }
    const ownership = new Ownership().give()
    expect(() => _assert(ownership)).toThrow('Unable to release (already settled), call `give` first')
  })
  {
    const value = 123
    test('@throws', () => {
      const ownership = new Ownership<number>().capture(123 as const).give()
      expect(() => _assert(ownership)).toThrow('Unable to release (not borrowed), call `borrow` first')

      function _assert<T extends Ownership.GenericBounds>(
        ownership: Ownership.ParamsBounds<T> | undefined,
      ): asserts ownership is Ownership.MorphAssertion<T, any> {
        release(ownership, value)
      }
    })
  }
})
