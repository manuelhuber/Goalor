import React from "react";
import style from "./Button.module.scss";
import {css} from "util/style";

type Props = { children: React.ReactNode[], align?: "right" | "center" }
const ButtonGroup: React.FC<Props> = props => <div className={css(style.buttonGroup,
    [style.alignCenter, props.align === "center"], [style.alignRight, props.align === "right"])}>
    {props.children}
</div>;

export default ButtonGroup;
