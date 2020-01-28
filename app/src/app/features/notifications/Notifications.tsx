import {clearNotification} from "app/features/notifications/duck";
import {AppState} from "app/Store";
import React from "react";
import {MdClose} from "react-icons/all";
import {connect} from "react-redux"
import {device} from "style/styleConstants";
import styled from "styled-components";

const mapStateToProps = (state: AppState) => {
    return {message: state.notifications.message, show: state.notifications.showMessage}
};

const mapDispatchToProps = {
    clearNotification
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const Notifications: React.FC<Props> = props =>
    <Root show={props.show}>
        <Message>
            {props.message}
            <Close onClick={props.clearNotification}><MdClose/></Close>
        </Message>
    </Root>;

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

const Root = styled.div<{ show: boolean; }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    transition: transform ease 250ms;
    text-align: center;
    z-index: 9999;
    transform: translateY(${p => p.show ? "0" : "-100%"});
`;
const Message = styled.div`
    display: inline-block;
    background: var(--color-neutral-shade3);
    min-width: 200px;
    max-width: 90vw;
    width: 95%;

    margin: 0 auto;
    padding: 8px;
    border-radius: 0 0 4px 4px;
    color: var(--color-neutral-tint3);
    @media ${device.screenMd} {
        width: auto;
    }
`;
const Close = styled.div`
    float: right;
    cursor: pointer;
`;
