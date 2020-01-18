import React from "react";
import style from "./Button.module.scss";
import {css} from "util/style";
import commonStyle from "style/Common.module.scss";

type Props = { children: React.ReactNode, onClick: () => void }
const IconButton: React.FC<Props> = props =>
    <button onClick={props.onClick} className={css(style.iconButton, commonStyle.clickable)}>
        <div className={style.icon}>{props.children}</div>
    </button>;

export default IconButton;
