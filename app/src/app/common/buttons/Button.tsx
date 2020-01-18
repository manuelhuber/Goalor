import React from "react";
import {css} from "util/style";
import style from "./Button.module.scss";

type Props = {
    design?: "link" | "secondary" | "outlined";
    block?: boolean;
    size?: "small" | "large";
    children: React.ReactNode;
}
const Button: React.FC<Props & React.ButtonHTMLAttributes<HTMLButtonElement>> = props => {
    // These CSS classes are from cutestrap
    let cssString = css(style.button, "button", ["-block", props.block], [style.noShadow, props.design === "link"]);
    if (props.design) {
        cssString += ` -${props.design}`;
    }
    if (props.size) {
        cssString += ` -${props.size}`;
    }

    // Override all props that cause an error, when passing it to the underlying button
    const {block, ...passOn} = props;

    return <button {...passOn} className={cssString}>{props.children}</button>;
};

export default Button;
