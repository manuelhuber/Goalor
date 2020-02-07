import React, {ReactNode, useEffect, useRef, useState} from "react";
import {MdMoreVert} from "react-icons/all";
import commonStyle from "style/Common.module.scss";
import styled, {css} from "styled-components";
import {nonNull} from "util/types";

interface PopupMenuEntry {
    icon?: any,
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

    return <Root ref={thisMenu}>
        <span ref={buttonRef} className={commonStyle.clickable} onClick={_ => setOpen(!isOpen)}><MdMoreVert/></span>
        {isOpen &&
        <Popup inRightHalf={inRightHalf} inLowerHalf={inLowerHalf}>
            {props.entries && props.entries.filter(nonNull).map(entry =>
                <Row key={entry.text ? entry.text.toString() : "fail"}
                     onClick={entry.onClick}>
                    <entry.icon/>
                    {entry.text}</Row>)}
            {props.children}
        </Popup>}
    </Root>;
};

export default PopupMenu;
const Root = styled.div`
    display: inline-block;
    position: relative;
`;
const Popup = styled.div<{ inLowerHalf: boolean, inRightHalf: boolean }>`
    position: absolute;
    z-index: 10;
    background-color: var(--color-neutral-tint3);
    box-shadow: 0 0 4px 1px var(--color-neutral-tint4);
    padding: 4px;
    ${p => !p.inRightHalf ? css`left: 100%` : css`right: 100%`};
    ${p => p.inLowerHalf ? css`bottom: 100%` : css`top: 100%`};
`;

const Row = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
`;
