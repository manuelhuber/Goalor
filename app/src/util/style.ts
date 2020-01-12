import {isString} from "util/types";

export function css(...entry: (string | [string, boolean])[]): string {
    return entry.filter(entry => !!entry && (isString(entry) || entry[1]))
                .map(entry => isString(entry) ? entry : entry[0])
                .join(" ");
}
