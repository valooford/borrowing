declare const __brand: unique symbol
interface Brand<B> {
  [__brand]: B
}

export type Branded<T, B = T> = T & Brand<B>
export type BrandOf<T> = T extends Branded<any, infer B> ? B : never
