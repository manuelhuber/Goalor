import React, {ReactNode} from "react";
import style from "./Modal.module.scss";
import {MdClose} from "react-icons/all";
import Header from "app/features/header/Header";
import Button from "app/common/buttons/Button";
import ButtonGroup from "app/common/buttons/ButtonGroup";

type Props = {
    open: boolean,
    onAttemptClose: () => void,
    title: ReactNode,
    children: ReactNode,
    confirmLabel?: ReactNode,
    onConfirm?: () => void
};

const Modal: React.FC<Props> = props => {
    const {open, onAttemptClose, title, children, confirmLabel, onConfirm} = props;
    const onOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onAttemptClose();
        }
    };
    const twoButtons = !!confirmLabel && !!onConfirm;
    return open && <div className={style.overlay} onClick={onOverlayClick}>
        <div className={style.modal}>
            <Header>
                <div className={style.header}>
                    <div>{title}</div>
                    <MdClose onClick={onAttemptClose}/>
                </div>
            </Header>
            <div className={style.content}>
                {children}
            </div>
            <div className={style.footer}>
                {twoButtons ?
                    <ButtonGroup>
                        <Button onClick={onAttemptClose} design="secondary">Close</Button>
                        {twoButtons &&
                        <Button onClick={onConfirm}>{confirmLabel}</Button>}
                    </ButtonGroup> :
                    <Button onClick={onAttemptClose}>Close</Button>
                }
            </div>
        </div>
    </div>;
};

export default Modal;
