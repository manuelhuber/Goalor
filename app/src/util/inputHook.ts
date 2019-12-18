import {useState} from "react";

/**
 * Tries to cast the value to the same type as the reference.
 * This is used for input fields - input type "number" still returns a string so we make it a number again
 */
function fixType<T>(reference: T, value: string) {
    const t = typeof reference;
    if (t === "string") {
        return String(value);
    } else if (t === "number") {
        return Number(value);
    } else {
        return value;
    }
}

export const useInput = initialValue => {
    const [value, setValue] = useState(initialValue);
    return {
        value,
        setValue,
        reset: () => setValue(initialValue),
        bind: {
            value,
            onChange: event => setValue(fixType(initialValue, event.target.value))
        }
    };
};
