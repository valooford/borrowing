/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { borrow, Ownership, release, take } from 'borrowing'

// file://./../take.ts
// file://./../../../README.md#take
// file://./../../../README.ru-RU.md#take
describe('take', () => {
  test('@example', () => {
    const ownership = new Ownership<number>().capture(123 as const)
    let _dst: number
    take(ownership, (value) => (_dst = value))
    expect(_dst!).toBe(123)
  })
  {
    function _assert<T extends Ownership.GenericBounds<number>>(
      ownership: Ownership.ParamsBounds<T> | undefined,
    ): asserts ownership is Ownership.MorphAssertion<T, 123> {
      borrow(ownership)
      release(ownership, ownership.captured)
    }
    test('@description', () => {
      {
        const ownership = new Ownership<number>().capture(123 as const).give()
        _assert(ownership)
        let _dst = ownership.take()
        expect(_dst).toBe(123)
        expect(() => take(ownership, (value) => (_dst = value))).toThrow('Unable to take (already taken)')
      }

      {
        const ownership = new Ownership<number>().capture(123 as const).give()
        _assert(ownership)
        let _dst: number
        expect(() => take(ownership, (value) => (_dst = value))).not.toThrow()
        expect(() => take(ownership, (value) => (_dst = value))).toThrow('Unable to take (already taken)')
      }
    })
  }
  describe('@throws', () => {
    {
      let _dst: number
      test('1st', () => {
        const ownership = new Ownership<number>().capture(123 as const).give()
        expect(() => take(ownership, (value) => (_dst = value))).toThrow(
          'Unable to take (not settled), call `release` or `drop` first or remove `give` call',
        )
      })
    }
    {
      let _dst: 123
      test('2nd', () => {
        const ownership = new Ownership<number>().capture(123 as const)
        take(ownership, (value) => (_dst = value))
        expect(() => take(ownership, (value) => (_dst = value))).toThrow('Unable to take (already taken)')
      })
    }
  })
})
