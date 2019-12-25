import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"
import style from "./Header.module.scss";
import {css} from "util/style";

const mapStateToProps = (state: AppState, props: { center?: boolean }) => props;
const mapDispatchToProps = {};
type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const Header: React.FC<Props> = props => {
    return <div className={css(style.header, [style.center, props.center])}>
        <span className={style.title}>Goalor</span>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
