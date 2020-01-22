import {useState} from "react";

/**
 * Tries to cast the value to the same type as the reference.
 * This is used for input fields - input type "number" still returns a string so we make it a number again
 */
function fixType<T>(reference: T, value: string): T {
    const t = typeof reference;
    if (value === null) {
        return null
    } else if (t === "string") {
        // @ts-ignore
        return value.toString();
    } else if (t === "number") {
        // @ts-ignore
        return parseInt(value);
    } else {
        // @ts-ignore
        return value;
    }
}

type InputType<T> = { value: T, setValue: (T) => void, reset: () => void, bind: { value: T, onChange } };

export function useInput<T>(initialValue: T): InputType<T> {
    const [value, setValue] = useState(initialValue);
    return {
        value,
        setValue,
        reset: () => setValue(initialValue),
        bind: {
            value,
            onChange: event => {
                let fixType1 = fixType(initialValue, event.target.value);
                setValue(fixType1);
            }
        }
    };
};
