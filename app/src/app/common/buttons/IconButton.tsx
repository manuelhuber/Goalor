import React from "react";
import style from "./Button.module.scss";

type Props = { children: React.ReactNode, onClick: () => void }
const IconButton: React.FC<Props> = props =>
    <button onClick={props.onClick} className={style.iconButton}>
        <div className={style.icon}>{props.children}</div>
    </button>;

export default IconButton;
