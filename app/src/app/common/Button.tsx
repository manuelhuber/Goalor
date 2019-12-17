import React from "react";
import {css} from "util/style";

type Props = {
    design?: "link" | "secondary" | "outlined"
    block?: boolean;
    size?: "small" | "large";
    children: React.ReactNode;
}
const Button: React.FC<Props & React.HTMLProps<HTMLButtonElement>> = props => {
    // These CSS classes are from cutestrap
    let cssString = css("button", ["-block", props.block]);
    if (props.design) {
        cssString += ` -${props.design}`;
    }
    if (props.size) {
        cssString += ` -${props.size}`;
    }

    // Override all props that cause an error, when passing it to the underlying button
    const passOn = {...props, block: null};

    // @ts-ignore the type of 'type' is wrongly typed
    return <button {...passOn} className={cssString}>{props.children}</button>;
};

export default Button;
