/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */

import type { Branded } from 'borrowing'

import { borrow, drop, Ownership, release, take } from 'borrowing'

// https://vitest.dev/guide/testing-types.html

describe('Ownership', () => {
  it('should initialize the general type', () => {
    const ownership = new Ownership<number>()
    expectTypeOf(ownership).toEqualTypeOf<Ownership<number, unknown, Branded<'settled', 'released'>, unknown>>()
  })
  describe('should have inferrable types', () => {
    type Instance = Ownership<'first', 'second', 'unknown', 'fourth'>
    type InstanceTypes = Ownership.inferTypes<Instance>
    expectTypeOf<InstanceTypes>().toEqualTypeOf<{
      General: 'first'
      Captured: 'second'
      State: 'unknown'
      ReleasePayload: 'fourth'
    }>()
  })
  it('should capture the constant form of the value', () => {
    const value = 'Hello' as const
    const _ownership = new Ownership<string>().capture(value)
    expectTypeOf<Ownership.inferTypes<typeof _ownership>['Captured']>().toExtend<'Hello'>()
  })
})

type Variants = 'open' | 'closed'
interface Config {
  value: Variants
}

describe('Usage (provide)', () => {
  function updateConfig<V extends Config, T extends Ownership.GenericBounds<Config>>(
    ownership: Ownership.ParamsBounds<T> | undefined,
    value: V,
  ): asserts ownership is Ownership.MorphAssertion<T, V> {
    borrow(ownership)
    release(ownership, value)
  }

  const config = { value: 'open' } as const satisfies Config

  it('should assert types in place', () => {
    let ownership = new Ownership<Config>().capture(config).give()
    const released0 = ownership?.take() // ├───────── Config | undefined
    expectTypeOf(released0).toEqualTypeOf<Config | undefined>()
    updateConfig(ownership, { value: 'closed' })
    const released1 = ownership.take() // ├───────── { readonly value: "closed" }
    expectTypeOf(released1).toEqualTypeOf<{ value: 'closed' }>()
    updateConfig(ownership, { value: 'open' })
    const released2 = ownership.take() // ├───────── { readonly value: "closed" }
    expectTypeOf(released2).toEqualTypeOf<{ value: 'closed' }>()
    ownership = ownership.give()
    updateConfig(ownership, { value: 'open' })
    const released3 = ownership.take() // └───────── { readonly value: "open" }
    expectTypeOf(released3).toEqualTypeOf<{ value: 'open' }>()
  })

  function updateValue<V extends Variants, T extends Ownership.GenericBounds<Config>>(
    ownership: Ownership.ParamsBounds<T> | undefined,
    value: V,
  ): asserts ownership is Ownership.MorphAssertion<T, T['General'] & { value: V }> {
    borrow(ownership)
    release(ownership, { value: ownership.captured.length < 0 ? value : value })
  }

  it('should assert types in place for partials', () => {
    let ownership = new Ownership<Config>().capture(config).give()
    const released0 = ownership?.take() // ├───────── Config | undefined
    expectTypeOf(released0).toExtend<Config | undefined>()
    updateValue(ownership, 'closed')
    const released1 = ownership.take() // ├───────── { readonly value: "closed" }
    expectTypeOf(released1).toExtend<{ value: 'closed' }>()
    expectTypeOf(released1.value).toEqualTypeOf<'closed'>()
    updateValue(ownership, 'open')
    const released2 = ownership.take() // ├───────── { readonly value: "closed" }
    expectTypeOf(released2).toExtend<{ value: 'closed' }>()
    expectTypeOf(released2.value).toEqualTypeOf<'closed'>()
    ownership = ownership.give()
    updateValue(ownership, 'open')
    const released3 = ownership.take() // └───────── { readonly value: "open" }
    expectTypeOf(released3).toExtend<{ value: 'open' }>()
    expectTypeOf(released3.value).toEqualTypeOf<'open'>()
  })

  function regularUpdateConfig<T extends Ownership.GenericBounds<Config>>(
    ownership: Ownership.ParamsBounds<T> | undefined,
    value: Config,
  ): asserts ownership is Ownership.MorphAssertion<T, Config> {
    borrow(ownership)
    release(ownership, value)
  }

  it('should stay usable without generic types', () => {
    let ownership = new Ownership<Config>().capture(config).give()
    const released0 = ownership?.take() // ├───────── Config | undefined
    expectTypeOf(released0).toEqualTypeOf<Config | undefined>()
    regularUpdateConfig(ownership, { value: 'closed' })
    const released1 = ownership.take() // ├───────── Config}
    expectTypeOf(released1).toEqualTypeOf<Config>()
    regularUpdateConfig(ownership, { value: 'open' })
    const released2 = ownership.take() // ├───────── Config
    expectTypeOf(released2).toEqualTypeOf<Config>()
    ownership = ownership.give()
    regularUpdateConfig(ownership, { value: 'open' })
    const released3 = ownership.take() // └───────── Config
    expectTypeOf(released3).toEqualTypeOf<Config>()
  })

  function throwAway<T extends Ownership.GenericBounds<number>>(
    ownership: Ownership.ParamsBounds<T> | undefined,
  ): asserts ownership is Ownership.LeaveAssertion<T> {
    borrow(ownership)
    drop(ownership)
  }

  it('should restrict access to protected/private properties', () => {
    const ownership = new Ownership<number>()
    let _visible: any
    let _hidden: any

    // @ts-expect-error: protected/private property
    _hidden = ownership.releasePayload
    _visible = ownership.capture(123)
    _visible = ownership.captured
    _visible = ownership.options
    _visible = ownership.expectPayload()
    _visible = ownership.give()
    _visible = ownership.take()

    const afterCapture = ownership.capture(123 as const)
    // @ts-expect-error: protected/private property
    _hidden = afterCapture.releasePayload
    _visible = afterCapture.capture(123)
    _visible = afterCapture.captured
    _visible = afterCapture.options
    _visible = afterCapture.expectPayload()
    _visible = afterCapture.give()
    _visible = afterCapture.take()

    const afterGive = afterCapture.give()
    // @ts-expect-error: protected/private property
    _hidden = afterGive?.releasePayload
    // @ts-expect-error: protected/private property
    _hidden = afterGive?.capture(123)
    // @ts-expect-error: protected/private property
    _hidden = afterGive?.captured
    // @ts-expect-error: protected/private property
    _hidden = afterGive?.options
    _visible = afterGive?.expectPayload()
    _visible = afterGive?.give()
    _visible = afterGive?.take()

    throwAway(afterGive)
    // @ts-expect-error: protected/private property
    _hidden = afterGive.releasePayload
    // @ts-expect-error: protected/private property
    _hidden = afterGive.capture(123)
    // @ts-expect-error: protected/private property
    _hidden = afterGive.captured
    // @ts-expect-error: protected/private property
    _hidden = afterGive.options
    _visible = afterGive.expectPayload()
    _visible = afterGive.give()
    _visible = afterGive.take()

    take(afterGive, () => void 0)
    expectTypeOf(afterGive).toBeNever()
  })
})

describe('Usage (consume)', () => {
  it('should validate the release payload', () => {
    function _good<T extends Ownership.GenericBounds<unknown, 123>>(
      ownership: Ownership.ParamsBounds<T>,
    ): asserts ownership is Ownership.LeaveAssertion<T> {
      borrow(ownership)
      drop(ownership, 123)
    }
    function _bad<T extends Ownership.GenericBounds<unknown, 123>>(
      ownership: Ownership.ParamsBounds<T>,
    ): asserts ownership is Ownership.LeaveAssertion<T> {
      borrow(ownership)
      // @ts-expect-error: typed as 123 (number)
      drop(ownership, '123')
    }
  })

  it('should validate the release payload for partials', () => {
    function _updateValue_bad<V extends Variants, T extends Ownership.GenericBounds<Config>>(
      ownership: Ownership.ParamsBounds<T> | undefined,
      value: V,
    ): asserts ownership is Ownership.MorphAssertion<T, T['General'] & { value: V }> {
      borrow(ownership)
      // @ts-expect-error: must be `{ value }`
      release(ownership, value)
    }
  })

  it('should restrict access to protected/private properties', () => {
    function _bad<T extends Ownership.GenericBounds<number>>(
      ownership: Ownership.ParamsBounds<T> | undefined,
    ): asserts ownership is Ownership.LeaveAssertion<T> {
      let _visible: any
      let _hidden: any

      // @ts-expect-error: protected/private property
      _hidden = ownership?.capture(123)
      // @ts-expect-error: protected/private property
      _hidden = ownership?.options
      // @ts-expect-error: protected/private property
      _hidden = ownership?.expectPayload()
      // @ts-expect-error: protected/private property
      _hidden = ownership?.give()
      // @ts-expect-error: protected/private property
      _hidden = ownership?.take()
      // @ts-expect-error: protected/private property
      _hidden = ownership?.captured
      // @ts-expect-error: protected/private property
      _hidden = ownership?.releasePayload

      borrow(ownership)
      // @ts-expect-error: protected/private property
      _hidden = ownership.capture(123)
      // @ts-expect-error: protected/private property
      _hidden = ownership.options
      // @ts-expect-error: protected/private property
      _hidden = ownership.expectPayload()
      // @ts-expect-error: protected/private property
      _hidden = ownership.give()
      // @ts-expect-error: protected/private property
      _hidden = ownership.take()
      // @ts-expect-error: protected/private property
      _hidden = ownership.releasePayload
      _visible = ownership.captured

      drop(ownership)
      expectTypeOf(ownership).toBeNever()
    }
  })
})

describe('Doc-tests', () => {
  // file://./../README.md#example
  // file://./../README.ru-RU.md#example
  test('Example', () => {
    const value = 'Hello, world!' // type 'Hello, world!'
    let ownership = new Ownership<string>().capture(value).give()
    replaceStr(ownership, 'M0RPH3D W0R1D')
    let morphedValue = ownership.take() // new type 'M0RPH3D W0R1D' | (*)

    ownership // type `Ownership<string, 'M0RPH3D W0R1D', ...>`
    ownership = ownership.give()
    sendMessage(ownership)
    ownership // new type `undefined`

    {
      /* test */
      expectTypeOf(morphedValue).toEqualTypeOf<'M0RPH3D W0R1D'>()
      expectTypeOf(ownership).toBeUndefined()
    }

    function replaceStr<V extends string, T extends Ownership.GenericBounds<string>>(
      ownership: Ownership.ParamsBounds<T> | undefined,
      value: V,
    ): asserts ownership is Ownership.MorphAssertion<T, V> {
      release(ownership, value)
    }

    function sendMessage<T extends Ownership.GenericBounds<string>>(
      ownership: Ownership.ParamsBounds<T> | undefined,
    ): asserts ownership is undefined {
      borrow(ownership)
      const value = ownership.captured // type `string`
      // fetch('https://web.site/api/log', { method: 'POST', body: value })
      drop(ownership)
    }
  })

  describe('Limitations and Recommendations', () => {
    test('1st', () => {
      interface State {
        value: string
      }
      let ownership = new Ownership<State>({ throwOnWrongState: false }).capture({ value: 'open' } as const).give()
      update(ownership, 'closed')
      const v1 = ownership.take().value // type 'closed'
      update(ownership, 'open')
      const v2 = ownership.take().value // type 'closed'
      type v2 = Ownership.inferTypes<typeof ownership>['Captured']['value'] // WRONG TYPE 'open'
      ownership = ownership.give()
      update(ownership, 'open')
      const v3 = ownership.take().value // type 'open'

      function update<T extends Ownership.GenericBounds<State>, V extends 'open' | 'closed'>(
        ownership: Ownership.ParamsBounds<T> | undefined,
        value: V,
      ): asserts ownership is Ownership.MorphAssertion<T, { value: V }> {
        borrow(ownership)
        release(ownership, { value })
      }

      {
        /* test */
        expectTypeOf(v1).toEqualTypeOf<'closed'>()
        expectTypeOf(v2).toEqualTypeOf<'closed'>()
        expectTypeOf(v3).toEqualTypeOf<'open'>()
      }
    })
    test.skip('1st (extended)', () => {
      interface State {
        value: string
      }
      let ownership = new Ownership<State>().capture({ value: 'open' } as const).give()
      update(ownership, 'closed')
      update(ownership, 'open')
      take(ownership, ({ value }) => {
        expectTypeOf(ownership.take().value).toEqualTypeOf<'closed'>()
        // TODO: fix types after invalid operations
        // expectTypeOf<Ownership.inferTypes<typeof ownership>['Captured']['value']>().toEqualTypeOf<'closed'>()
        // expectTypeOf(value).toEqualTypeOf<'closed'>()
      })

      function update<T extends Ownership.GenericBounds<State>, V extends 'open' | 'closed'>(
        ownership: Ownership.ParamsBounds<T> | undefined,
        value: V,
      ): asserts ownership is Ownership.MorphAssertion<T, { value: V }> {
        borrow(ownership)
        release(ownership, { value })
      }
    })
  })
})
