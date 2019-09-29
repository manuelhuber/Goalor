export function replaceItem<T>(array: T[], updateIndex: number, replace: (T) => T) {
    return array.map((value, index) => {
        if (index !== updateIndex) {
            return value;
        } else {
            return replace(value);
        }
    });
}
