import {AppState} from "app/store";
import React from "react";
import {connect} from "react-redux"
import style from "./Header.module.scss";

const mapStateToProps = (state: AppState) => {
    return {}
};

const mapDispatchToProps = {};

const Header: React.FC<Props> = props => {
    return <div className={style.header}>
        <span className={style.title}>Goalor</span>
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Header);
