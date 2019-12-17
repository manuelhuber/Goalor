import {isString} from "util/types";

export function jc(...classes: string[]): string {
    return classes.join(" ");
}


export function css(...entry: (string | [string, boolean])[]): string {
    return entry.filter(entry => isString(entry) || entry[1])
        .map(entry => isString(entry) ? entry : entry[0])
        .join(" ");
}
