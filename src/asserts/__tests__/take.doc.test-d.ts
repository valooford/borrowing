/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */

import type { Branded } from 'borrowing'

import { Ownership, take } from 'borrowing'

// https://vitest.dev/guide/testing-types.html

//? copy the contents of each test without /* test */ blocks into the associated files (-> JSDoc -> README)

// file://./../take.ts
// file://./../../../README.md#take
// file://./../../../README.ru-RU.md#take
describe('take', () => {
  test('@example', () => {
    const ownership = new Ownership<number>().capture(123 as const)
    let _dst: number
    take(ownership, (value, _payload: unknown) => (_dst = value))
  })
  {
    const ownership = new Ownership<number, 123>().capture(123 as const)
    test('@description', () => {
      let _dst = ownership.take()
      ownership // type `Ownership<...>`
      {
        /* test */
        expectTypeOf(ownership).toEqualTypeOf<Ownership<number, 123, Branded<'settled', 'released'>, unknown>>()
      }
      // safe
      take(ownership, (value) => (_dst = value))
      ownership // type `never`
      {
        /* test */
        expectTypeOf(ownership).toBeNever()
      }
    })
  }
  describe('@throws', () => {
    {
      let _dst: number
      test('1st', () => {
        const ownership = new Ownership<number>().capture(123 as const).give()
        take(ownership, (value) => (_dst = value)) // Error: Unable to take (not settled), call `release` or `drop` first or remove `give` call
      })
    }
    {
      let _dst: 123
      test('2nd', () => {
        const ownership = new Ownership<number>().capture(123 as const)
        take(ownership, (value) => (_dst = value))
        take(ownership, (value) => (_dst = value)) // Error: Unable to take (already taken)
      })
    }
  })
})
