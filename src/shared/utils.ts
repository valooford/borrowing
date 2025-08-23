/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/** @see https://github.com/microsoft/TypeScript/issues/37663#issuecomment-2130687770 */
export const isFunction = (x: unknown): x is Function => typeof x === 'function'
