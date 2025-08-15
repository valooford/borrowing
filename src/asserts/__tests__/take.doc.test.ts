import { borrow, Ownership, release, take } from 'borrowing'

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/no-unsafe-return */

// file://./../take.ts
// file://./../../../README.md#take
// file://./../../../README.ru-RU.md#take
describe('take', () => {
  test('@example', () => {
    {
      const ownership = new Ownership<number>().capture(123 as const)
      let _dst: number
      take(ownership, (value) => (_dst = value))
      expect(_dst!).toBe(123)
    }

    {
      const ownership = new Ownership<number>().capture(123 as const)
      const dst: { current?: number } = {}
      take(ownership, dst, 'current')
      expect(dst.current).toBe(123)
    }
  })
  {
    function _assert<T extends Ownership.GenericBounds<number>>(
      ownership: Ownership.ParamsBounds<T> | undefined,
    ): asserts ownership is Ownership.MorphAssertion<T, number> {
      borrow(ownership)
      release(ownership, ownership.captured)
    }
    test('@description', () => {
      {
        const ownership = new Ownership<number>().capture(123 as const).give()
        _assert(ownership)
        const _dst = ownership.take()
        expect(_dst).toBe(123)
        const dst: { current?: number } = {}
        expect(() => take(ownership, dst, 'current')).toThrow('Unable to take (already taken)')
      }

      {
        const ownership = new Ownership<number>().capture(123 as const).give()
        _assert(ownership)
        const dst: { current?: number } = {}
        expect(() => take(ownership, dst, 'current')).not.toThrow()
        expect(() => take(ownership, dst, 'current')).toThrow('Unable to take (already taken)')
      }
    })
  }
  describe('@throws', () => {
    {
      const dst: { current?: number } = {}
      test('1st', () => {
        const ownership = new Ownership<number>().capture(123 as number).give()
        expect(() => take(ownership, dst, 'current')).toThrow(
          'Unable to take (not settled), call `release` or `drop` first or remove `give` call',
        )
      })
    }
    {
      const dst: { current?: number } = {}
      test('2nd', () => {
        const ownership = new Ownership<number>().capture(123 as number)
        take(ownership, dst, 'current')
        expect(() => take(ownership, dst, 'current')).toThrow('Unable to take (already taken)')
      })
    }
  })
})
