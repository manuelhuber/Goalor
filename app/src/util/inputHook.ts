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

type InputType<T> = {
    value: T,
    setValue: (T) => void,
    error: string,
    setError: (string) => void,
    validateNow: () => boolean,
    reset: () => void,
    bind: InputBind<T>
};
type InputBind<T> = { value: T, onChange, error: string }

export function useInput<T>(
    initialValue: T,
    validate: (T) => string = () => undefined): InputType<T> {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState();
    const validateNow = (v = value) => {
        let error = validate(v);
        setError(error);
        return !error;
    };
    return {
        value,
        setValue,
        error,
        setError,
        validateNow,
        reset: () => setValue(initialValue),
        bind: {
            value,
            error,
            onChange: event => {
                let fixedValue = fixType(initialValue, event.target.value);
                setValue(fixedValue);
                validateNow(fixedValue);
            },
        }
    };
}

export const notEmpty = (s): string => !!s ? undefined : "Can't be empty";

export function isValid(ins: InputType<any>[]) {
    let validForm = true;
    ins.forEach(i => {
        validForm = i.validateNow() && validForm;
    });
    return validForm;
}

export function errors(ins: InputType<any>[]) {
    return ins.map(input => !input.error);
}
