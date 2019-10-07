import React from "react";

type Props = {
    checked: boolean;
    label?: string,
    onChange?: (newValue: boolean) => void
    disable?: boolean;
    value?: string;
}
const Checkbox: React.FC<Props> = props =>
    <label className="field">
        <input type="checkbox"
               disabled={props.disable}
               value={props.value}
               checked={props.checked}
               onChange={(event) => {
                   props.onChange && props.onChange(event.target.checked);
               }}/>
        <span className='label'>{props.label}</span>
    </label>;

export default Checkbox;
