/** */
declare const __brand: unique symbol
interface Brand<B> {
  [__brand]: B
}

/** @internal */
export type Branded<T, B = T> = T & Brand<B>
/** @internal */
export type BrandOf<T> = T extends Branded<any, infer B> ? B : never
