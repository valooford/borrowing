/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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
    take(ownership, (value) => (_dst = value))
    // or
    const dst: { current?: number } = {}
    take(ownership, dst, 'current')
  })
  {
    const ownership = new Ownership<number, 123>().capture(123 as const)
    test('@description', () => {
      const _dst = ownership.take()
      ownership // type `Ownership<...>`
      {
        /* test */
        expectTypeOf(ownership).toEqualTypeOf<Ownership<number, 123, Branded<'settled', 'released'>, unknown>>()
      }
      // safe
      const dst: { current?: number } = {}
      take(ownership, dst, 'current')
      ownership // type `never`
      {
        /* test */
        expectTypeOf(ownership).toBeNever()
      }
    })
  }
  describe('@throws', () => {
    {
      const dst: { current?: number } = {}
      test('1st', () => {
        const ownership = new Ownership<number>().capture(123 as number).give()
        take(ownership, dst, 'current') // Error: Unable to take (not settled), call `release` or `drop` first or remove `give` call
      })
    }
    {
      const dst: { current?: number } = {}
      test('2nd', () => {
        const ownership = new Ownership<number>().capture(123 as number)
        take(ownership, dst, 'current')
        take(ownership, dst, 'current') // Error: Unable to take (already taken)
      })
    }
  })
})
