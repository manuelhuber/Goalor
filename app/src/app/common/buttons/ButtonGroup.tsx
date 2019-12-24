import React from "react";
import {css} from "util/style";
import style from "./Button.module.scss";

type Props = { children: React.ReactNode[], align?: "right" | "center" }
const ButtonGroup: React.FC<Props> = props => <div className={css(style.buttonGroup,
        [style.alignCenter, props.align === "center"], [style.alignRight, props.align === "right"])}>
    <span className={style.buttonGroupShadow}>{props.children}</span>
</div>;

export default ButtonGroup;
