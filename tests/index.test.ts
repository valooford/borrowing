import { borrow, Ownership, release, take } from 'borrowing'

describe('take', () => {
  it('should provide the captured value back', () => {
    function noop<T extends Ownership.GenericBounds<number>>(
      ownership: Ownership.ParamsBounds<T> | undefined,
    ): asserts ownership is Ownership.MorphAssertion<T, number> {
      borrow(ownership)
      release(ownership, ownership.captured)
    }
    const value = 123
    const ownership = new Ownership<number>().capture(value).give()
    noop(ownership)
    const res: { current?: 123 } = {}
    take(ownership, res, 'current')
    expect(res.current).toBe(123)
  })
})
