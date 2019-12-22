import React from "react";
import style from "./Button.module.scss";

type Props = { children: React.ReactNode, onClick: () => void }
const IconButton: React.FC<Props> = props =>
    <button onClick={props.onClick} className={style.iconButton}>
        {props.children}
    </button>;

export default IconButton;
