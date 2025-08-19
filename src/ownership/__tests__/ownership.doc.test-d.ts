import type { ProviderOwnership } from '../interfaces'
import type { Branded } from '@shared/types'

import { borrow } from '@asserts/borrow'
import { drop } from '@asserts/drop'
import { release } from '@asserts/release'
import { take } from '@asserts/take'

import { Ownership } from '../interfaces'

/* eslint-disable @typescript-eslint/no-unused-expressions */

/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */

// https://vitest.dev/guide/testing-types.html

//? copy the contents of each test without /* test */ blocks into the associated files (-> JSDoc -> README)

// file://./../interfaces.ts
// file://./../../../README.md#ownership
// file://./../../../README.ru-RU.md#ownership
describe('Ownership', () => {
  describe('constructor', () => {
    test('@example', () => {
      type Status = 'pending' | 'success' | 'error'
      const ownership = new Ownership<Status>({ throwOnWrongState: false }) // type `Ownership<Status, unknown, ...>`
      {
        /* test */
        expectTypeOf(ownership).toEqualTypeOf<Ownership<Status, unknown, Branded<'settled', 'released'>, unknown>>()
      }
    })
  })
  describe('namespace', () => {
    test('@example', () => {
      const options: Ownership.Options = {
        throwOnWrongState: false,
        takenPlaceholder: undefined,
      }
      const _ownership = new Ownership<string>(options).capture('foo' as const)
      type Captured = Ownership.inferTypes<typeof _ownership>['Captured'] // 'foo'
      {
        /* test */
        expectTypeOf<Captured>().toEqualTypeOf<'foo'>()
        expectTypeOf<Ownership.inferTypes<typeof _ownership>['General']>().toEqualTypeOf<string>()
      }

      function _assert<T extends Ownership.GenericBounds<string>>(
        ownership: Ownership.ParamsBounds<T> | undefined,
      ): asserts ownership is Ownership.MorphAssertion<T, string> {
        // (...)
        release(ownership, 'bar')
      }
      function _throwAway<T extends Ownership.GenericBounds<string, 0 | 1>>(
        ownership: Ownership.ParamsBounds<T> | undefined,
      ): asserts ownership is Ownership.LeaveAssertion<T> {
        borrow(ownership)
        type Payload = Ownership.inferTypes<typeof ownership>['ReleasePayload'] // 0 | 1
        drop(ownership, 0)

        {
          /* test */
          expectTypeOf<Payload & 2>().toBeNever()
        }
      }
    })
  })
  describe('#captured', () => {
    test('@example', () => {
      type Status = 'pending' | 'success' | 'error'
      const ownership = new Ownership<Status>().capture('pending' as const)
      const captured = ownership.captured // type 'pending'
      {
        /* test */
        expectTypeOf(captured).toEqualTypeOf<'pending'>()

        // @ts-expect-error: the value type should be assignable to `Status`
        ownership.capture('unknown' as const)
      }

      function _assert<T extends Ownership.GenericBounds<Status>>(
        ownership: Ownership.ParamsBounds<T> | undefined,
      ): asserts ownership is Ownership.LeaveAssertion<T> {
        borrow(ownership)
        const captured = ownership.captured // type `Status`
        {
          /* test */
          assertType<Status>(captured)
        }
      }
    })
  })
  describe('#capture()', () => {
    test('@example', () => {
      type Status = 'pending' | 'success' | 'error'
      const ownership = new Ownership<Status>().capture('pending' as const) // type `Ownership<Status, 'pending', ...>`
      {
        /* test */
        expectTypeOf(ownership).toEqualTypeOf<Ownership<Status, 'pending', Branded<'settled', 'released'>, unknown>>()
      }
    })
  })
  describe('#expectPayload()', () => {
    {
      const ownership = new Ownership<number>().capture(123 as const)
      test('@example', () => {
        const acceptExitCode = ownership.expectPayload<0 | 1>().give()
        _assert(acceptExitCode)
        take(acceptExitCode, (_, payload) => {
          payload // 0
        })

        function _assert<T extends Ownership.GenericBounds<number, 0 | 1>>(
          ownership: Ownership.ParamsBounds<T> | undefined,
        ): asserts ownership is Ownership.LeaveAssertion<T> {
          borrow(ownership)
          {
            /* test */
            // @ts-expect-error: error code should be `0 | 1`
            drop(ownership, 2)
          }
          drop(ownership, 0)
        }
      })
    }
  })
  describe('#give()', () => {
    test('@example', () => {
      const ownership = new Ownership<string>().capture('pending' as const)
      const ownershipArg = ownership.give()
      _assert(ownership)
      ownership // type `never`
      _assert(ownershipArg)
      ownershipArg // type `ProviderOwnership<...>`

      function _assert<T extends Ownership.GenericBounds<string>>(
        ownership: Ownership.ParamsBounds<T> | undefined,
      ): asserts ownership is Ownership.MorphAssertion<T, 'success'> {
        // (...)
      }

      {
        /* test */
        expectTypeOf(ownership).toBeNever()
        expectTypeOf(ownershipArg).toEqualTypeOf<ProviderOwnership<string, 'success', any, any>>()
      }
    })
  })
  describe('#take()', () => {
    test('@example', () => {
      type Status = 'pending' | 'success' | 'error'
      const ownership = new Ownership<Status>().capture('pending' as const)
      let _value = ownership.take() // 'pending'
      _value = ownership.take() // undefined
      {
        /* test */
        expectTypeOf(_value).toEqualTypeOf<'pending'>()
      }
    })
    {
      const ownership = new Ownership()
      let _morphedValue: any
      test('@description', () => {
        // unsafe because the ownership is still in use (not `undefined` or `never`)
        _morphedValue = ownership.take()
        {
          /* test */
          expectTypeOf(ownership).not.toBeNever()
        }

        // safer alternative - asserts `ownership is never`
        take(ownership, (str) => void (_morphedValue = str))
        {
          /* test */
          expectTypeOf(ownership).toBeNever()
        }
      })
    }
  })
})
