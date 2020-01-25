import React from "react";
import commonStyle from "style/Common.module.scss";
import {css} from "util/style";
import style from "./Button.module.scss";

type Props = { children: React.ReactNode, onClick?: () => void }
const IconButton: React.FC<Props & React.ButtonHTMLAttributes<HTMLButtonElement>> = props =>
    <button type="button" onClick={props.onClick} className={css(style.iconButton, commonStyle.clickable)} {...props}>
        <div className={style.icon}>{props.children}</div>
    </button>;

export default IconButton;
