import React from "react";

type Props = { label: React.ReactNode }
const Input: React.FC<Props & React.InputHTMLAttributes<HTMLInputElement>> = props =>
    <label className="field">
        {props.type === "textarea" ? <textarea/> : <input {...props}/>}
        <span className="label">{props.label}</span>
    </label>;

export default Input;
