/**
 * A utility library that provides borrowing mechanisms via assertion functions.
 *
 * @remarks
 * Allows you to pass values to a function and get the most accurate value type
 * in the following code:
 *
 * - either Morphed one
 *   - `{value: 'open'}` \>\>\> `{value: 'closed'}`
 *
 * - or no longer under control (Leaved)
 *   - `{value: 'closed'}` \>\>\> `undefined`
 *
 * @packageDocumentation
 */

export { borrow } from '@asserts/borrow'
export { drop } from '@asserts/drop'
export { release } from '@asserts/release'
export { take } from '@asserts/take'
export { Ownership } from '@ownership/interfaces'
export type { Branded, BrandOf } from '@shared/types'
