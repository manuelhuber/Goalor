import React, {ReactNode} from "react";
import {jc} from "util/style";

type Props = { label: React.ReactNode, children: ReactNode, nullOption?: boolean, noMargin?: boolean }
const Dropdown: React.FC<Props & React.SelectHTMLAttributes<HTMLSelectElement>> = props => {
    // Override all props that cause an error, when passing it to the underlying button
    const {nullOption, noMargin, ...passOn} = props;
    return <label className={jc("field", ["mb-zero", props.noMargin])}>
        <select {...passOn}>
            {props.nullOption &&
            <option value={undefined}/>}
            {props.children}
        </select>
        <span className="label">{props.label}</span>
    </label>;
};

export default Dropdown;
