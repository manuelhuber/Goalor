import {clearNotification} from "app/features/notifications/duck";
import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"
import {css} from "util/style";
import style from "./Notifications.module.scss";

const mapStateToProps = (state: AppState) => {
    return {message: state.notifications.message, show: state.notifications.showMessage}
};

const mapDispatchToProps = {
    clearNotification
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const Notifications: React.FC<Props> = props => {
    return <div className={css(style.root, [style.hidden, !props.show])}>
        <div className={style.message}>
            {props.message}
        </div>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
