/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { borrow, drop, Ownership, take } from 'borrowing'

// file://./../interfaces.ts
// file://./../../../README.md#ownership
// file://./../../../README.ru-RU.md#ownership
describe('Ownership', () => {
  describe('constructor', () => {
    test('@example', () => {
      type Status = 'pending' | 'success' | 'error'
      const ownership = new Ownership<Status>({
        throwOnWrongState: false,
      }).give()
      expect(() => take(ownership, () => void 0)).not.toThrow()
    })
  })
  describe('#captured', () => {
    test('@example', () => {
      type Status = 'pending' | 'success' | 'error'
      const ownership = new Ownership<Status>().capture('pending' as const)
      expect(ownership.captured).toBe('pending')
      _assert(ownership.give())

      function _assert<T extends Ownership.GenericBounds<Status>>(
        ownership: Ownership.ParamsBounds<T> | undefined,
      ): asserts ownership is Ownership.LeaveAssertion<T> {
        borrow(ownership)
        expect(ownership.captured).toBe('pending')
      }
    })
  })
  describe('#capture()', () => {
    test('@example', () => {
      type Status = 'pending' | 'success' | 'error'
      const ownership = new Ownership<Status>().capture('pending' as const)
      expect(ownership.captured).toBe('pending')
    })
  })
  describe('#expectPayload()', () => {
    {
      const ownership = new Ownership<number>().capture(123 as const)
      test('@example', () => {
        const acceptExitCode = ownership.expectPayload<0 | 1>().give()
        _assert(acceptExitCode)
        drop(acceptExitCode, (payload) => {
          expect(payload).toBe(0)
        })

        function _assert<T extends Ownership.GenericBounds<number, 0 | 1>>(
          ownership: Ownership.ParamsBounds<T> | undefined,
        ): asserts ownership is Ownership.LeaveAssertion<T> {
          borrow(ownership)
          drop(ownership, 0)
        }
      })
    }
  })
  describe('#give()', () => {
    test('@example', () => {
      const ownership = new Ownership<string>().capture('pending' as const)
      expect(() => _assert(ownership)).toThrow(
        'Unable to borrow (not given), call `give` first',
      )
      const ownershipArg = ownership.give()
      expect(() => _assert(ownershipArg)).not.toThrow()

      function _assert<T extends Ownership.GenericBounds<string>>(
        ownership: Ownership.ParamsBounds<T> | undefined,
      ): asserts ownership is Ownership.MorphAssertion<T, 'success'> {
        borrow(ownership)
      }
    })
  })
  describe('#take()', () => {
    test('@example', () => {
      type Status = 'pending' | 'success' | 'error'
      const ownership = new Ownership<Status>().capture('pending' as const)
      let _value = ownership.take()
      expect(_value).toBe('pending')
      _value = ownership.take()
      expect(_value).toBe(undefined)
    })
    {
      const ownership = new Ownership({ throwOnWrongState: false }).capture(123)
      let _morphedValue: any
      test('@description', () => {
        _morphedValue = ownership.take()
        expect(_morphedValue).toBe(123)

        take(ownership, (str) => void (_morphedValue = str))
        expect(_morphedValue).toBeUndefined()
      })
    }
  })
})
