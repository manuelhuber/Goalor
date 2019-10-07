export {}

declare global {
    interface Array<T> {
        without(item: T): Array<T>
    }
}

Array.prototype.without = function (item) {
    return this.filter(value => value !== item);
};

