import React from "react";
import {css} from "util/style";

type Props = { label: React.ReactNode, noMargin?: boolean }
const Input: React.FC<Props & React.InputHTMLAttributes<HTMLInputElement>> = props => {
    const {noMargin, ...passOnProps} = props;
    return <label className={css("field", ["mb-zero", props.noMargin])}>
        <input {...passOnProps}/>
        <span className="label">{props.label}</span>
    </label>;
};

export default Input;
