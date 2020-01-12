import React, {ReactNode} from "react";

type Props = { label: React.ReactNode, children: ReactNode, nullOption?: boolean }
const Dropdown: React.FC<Props & React.SelectHTMLAttributes<HTMLSelectElement>> = props => {
    // Override all props that cause an error, when passing it to the underlying button
    const {nullOption, ...passOn} = props;
    return <label className="field">
        <select {...passOn}>
            {props.nullOption &&
            <option value={null}/>}
            {props.children}
        </select>
        <span className="label">{props.label}</span>
    </label>;
};

export default Dropdown;
