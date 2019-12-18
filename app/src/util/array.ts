export function without<T>(arr: T[], item: T): T[] {
    return arr.filter(value => value !== item);
}

export function replaceByIndex<T>(array: T[], updateIndex: number, replace: (T) => T) {
    return array.map((value, index) => {
        if (index !== updateIndex) {
            return value;
        } else {
            return replace(value);
        }
    });
}

export function replaceByComp<T>(array: T[], replace: T, comp: (T) => any) {
    return array.map((value, index) => {
        if (comp(value) !== comp(replace)) {
            return value;
        } else {
            return replace;
        }
    });
}
