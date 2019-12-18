export function clone<T>(orig: T): T {
    return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig)
}
