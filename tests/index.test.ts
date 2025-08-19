/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { borrow, Ownership, release, take } from 'borrowing'

describe('take', () => {
  it('should provide the captured value back', () => {
    function noop<T extends Ownership.GenericBounds<number>>(
      ownership: Ownership.ParamsBounds<T> | undefined,
    ): asserts ownership is Ownership.MorphAssertion<T, T['Captured']> {
      borrow(ownership)
      release(ownership, ownership.captured)
    }
    const value = 123
    const ownership = new Ownership<123>().capture(value).give()
    noop(ownership)
    let dst: 123
    take(ownership, (value) => (dst = value))
    expect(dst!).toBe(123)
  })
})
