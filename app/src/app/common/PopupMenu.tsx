import React, {ReactNode, useEffect, useRef, useState} from "react";
import {MdMoreVert} from "react-icons/all";
import commonStyle from "style/Common.module.scss";
import {css} from "util/style";
import {nonNull} from "util/types";
import style from "./PopupMenu.module.scss";

interface PopupMenuEntry {
    icon?: ReactNode,
    text: ReactNode,
    onClick: () => any
}

type Props = { children?: React.ReactNode, entries?: (PopupMenuEntry | null)[] }
const PopupMenu: React.FC<Props> = props => {
    const [isOpen, setOpen] = useState(false);
    const buttonRef = useRef<HTMLSpanElement>(null);
    const thisMenu = useRef<HTMLDivElement>(null);
    let rect = buttonRef.current && buttonRef.current.getBoundingClientRect();
    const inLowerHalf = rect && rect.y > window.innerHeight / 2;
    const inRightHalf = rect && rect.x > window.innerWidth / 2;

    let onClickOutside = ev => {
        if (thisMenu.current && !thisMenu.current.contains(ev.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("click", onClickOutside);
        }
        return () => {
            document.removeEventListener("click", onClickOutside);
        }
    }, [isOpen]);
    return <div className={style.root} ref={thisMenu}>
        <span ref={buttonRef} className={commonStyle.clickable} onClick={_ => setOpen(!isOpen)}><MdMoreVert/></span>
        {isOpen &&
        <div className={css(style.popup,
            [style.top, inLowerHalf],
            [style.bottom, !inLowerHalf],
            [style.left, inRightHalf],
            [style.right, !inRightHalf])}>
            {props.entries && props.entries.filter(nonNull).map(entry =>
                <div key={entry.text ? entry.text.toString() : "fail"}
                     className={style.row}
                     onClick={entry.onClick}>{entry.icon}{entry.text}</div>)}
            {props.children}
        </div>}
    </div>;
};

export default PopupMenu;
