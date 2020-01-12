import {AppState} from "app/Store";
import React, {ReactNode} from "react";
import {connect} from "react-redux"
import style from "./Header.module.scss";
import {css} from "util/style";

const mapStateToProps = (state: AppState, props: { children: ReactNode, noStyle?: boolean }) => props;
const mapDispatchToProps = {};
type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const Header: React.FC<Props> = props => {
    return <header className={css(style.header, [style.title, !props.noStyle])}>{props.children}</header>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
