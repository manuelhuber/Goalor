import React, {ReactNode, useEffect, useRef, useState} from "react";
import {MdMoreVert} from "react-icons/all";
import style from "./PopupMenu.module.scss";
import commonStyle from "style/Common.module.scss";
import {css} from "util/style";

interface PopupMenuEntry {
    icon?: ReactNode,
    text: ReactNode,
    onClick: () => any
}

type Props = { children?: React.ReactNode, entries?: PopupMenuEntry[] }
const PopupMenu: React.FC<Props> = props => {
    const [isOpen, setOpen] = useState(false);
    const buttonRef = useRef<HTMLSpanElement>();
    const everythingRef = useRef<HTMLDivElement>();
    let rect = buttonRef.current && buttonRef.current.getBoundingClientRect();
    const inLowerHalf = rect && rect.y > window.innerHeight / 2;
    const inRightHalf = rect && rect.x > window.innerWidth / 2;

    let onClickOutside = ev => {
        if (!everythingRef.current.contains(ev.target)) {
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
    return <div className={style.root} ref={everythingRef}>
        <span ref={buttonRef} className={commonStyle.clickable} onClick={_ => setOpen(!isOpen)}><MdMoreVert/></span>
        {isOpen &&
        <div className={css(style.popup,
            [style.top, inLowerHalf],
            [style.bottom, !inLowerHalf],
            [style.left, inRightHalf],
            [style.right, !inRightHalf])}>
            {props.entries && props.entries.map(entry =>
                <div key={entry.text.toString()}
                     className={style.row}
                     onClick={entry.onClick}>{entry.icon}{entry.text}</div>)}
            {props.children}
        </div>}
    </div>;
};

export default PopupMenu;
