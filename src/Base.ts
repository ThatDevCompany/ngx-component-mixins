/**
 * An empty class to form the base of all Mixins
 */
export class BaseMixin {}

/**
 * A Typescript definition of a constructor function
 */
export type Constructor<T = {}> = new (...args: any[]) => T
