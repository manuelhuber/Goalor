export function clone<T>(orig: T, override?: object): T {
    return {...Object.assign(Object.create(Object.getPrototypeOf(orig)), orig), ...override}
}
