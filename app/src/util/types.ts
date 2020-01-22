export function isString(value: any): boolean {
    return typeof value === "string";
}

export function nonNull<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}
