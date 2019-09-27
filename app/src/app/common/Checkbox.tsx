import React from "react";

type Props = {
    checked: boolean;
    onChange?: (newValue: boolean) => void
    disable?: boolean;
    value?: string;
}
const Checkbox: React.FC<Props> = props =>
    <input type="checkbox" disabled={props.disable} value={props.value} checked={props.checked} onChange={(event) => {
        props.onChange && props.onChange(event.target.checked);
    }}/>;

export default Checkbox;
