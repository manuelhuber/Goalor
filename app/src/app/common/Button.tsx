import React from "react";
import {css} from "util/Style";

type Props = {
    type?: "link" | "secondary" | "outlined"
    block?: boolean;
    size?: "small" | "large";
    onClick: () => void;
    children: React.ReactNode;
}
const Button: React.FC<Props> = props => {
    let cssString = css("button", ["-block", props.block]);
    if (props.type) {
        cssString += ` -${props.type}`;
    }
    if (props.size) {
        cssString += ` -${props.size}`;
    }
    return <button className={cssString} onClick={props.onClick}>{props.children}</button>;
};


export default Button;
