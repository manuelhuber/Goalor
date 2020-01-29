import Button from "app/common/buttons/Button";
import ButtonGroup from "app/common/buttons/ButtonGroup";
import Header from "app/features/header/Header";
import React, {ReactNode} from "react";
import {MdClose} from "react-icons/all";
import {device, screenLg} from "style/styleConstants";
import styled, {css} from "styled-components";

type Props = {
    open: boolean,
    onAttemptClose: () => void,
    title: ReactNode,
    children: ReactNode,
    confirmLabel?: ReactNode,
    onConfirm?: () => void
    confirmDisabled?: boolean
};

const Modal: React.FC<Props> = props => {
    const {open, onAttemptClose, title, children, confirmLabel, onConfirm} = props;
    const onOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onAttemptClose();
        }
    };
    const twoButtons = !!confirmLabel && !!onConfirm;
    return <Overlay hidden={!open} onClick={onOverlayClick}>
        <ModalWrapper>
            <Header>
                <HeaderWrapper>
                    <div>{title}</div>
                    <Clickable>
                        <MdClose onClick={onAttemptClose}/>
                    </Clickable>
                </HeaderWrapper>
            </Header>
            <Content>{children}</Content>
            <Footer>{twoButtons
                ? <ButtonGroup>
                    <Button onClick={onAttemptClose} design="secondary">Close</Button>
                    {twoButtons &&
                    <Button onClick={onConfirm} disabled={props.confirmDisabled}>{confirmLabel}</Button>}
                </ButtonGroup>
                : <Button onClick={onAttemptClose} disabled={props.confirmDisabled}>Close</Button>
            }
            </Footer>
        </ModalWrapper>
    </Overlay>;
};

export default Modal;

const Overlay = styled.div<{ hidden: boolean }>`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--color-neutral-tint4);
    z-index: 99;
    ${p => p.hidden && css`display: none`}
`;
const ModalWrapper = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    @media ${device.screenLg} {
        border-radius: var(--border-radius);
        overflow: hidden;
        left: 50%;
        right: auto;
        top: 50%;
        bottom: auto;
        min-width: calc(${screenLg}/2);
        transform: translate(-50%, -50%);
    }

    display: flex;
    flex-direction: column;
    background: var(--color-neutral-tint2);
`;
const HeaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
const Clickable = styled.div`
cursor: pointer;
`;
const Content = styled.div`
    padding: var(--rhythm-half);
    flex-grow: 1;
    overflow: auto;
`;
const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: var(--rhythm-half);
`;
