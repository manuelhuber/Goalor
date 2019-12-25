import {logout} from "app/features/auth/duck";
import {notify} from "app/features/notifications/duck";
import React, {useState} from "react";
import {MdChat, MdClose, MdMenu, MdPerson, MdPowerSettingsNew} from "react-icons/md";
import {connect} from "react-redux"
import {Link} from "react-router-dom";
import {bindActionCreators} from "redux";
import commonStyle from "style/Common.module.scss";
import {css} from "util/style";
import style from "./Menu.module.scss";
import Header from "app/features/header/Header";
import {useHistory} from "react-router";
import {AppState} from "app/Store";

const mapStateToProps = (state: AppState) => ({isLoggedIn: state.auth.authenticated});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    notify,
    logout
}, dispatch);
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Menu: React.FC<Props> = props => {

    const [show, setShow] = useState(false);
    const history = useHistory();
    const linkTo = (url: string) => ({onClick: () => history.push(url)});

    return <div className={style.root}>
        <div className={style.header}>
            <Header center={true}/>
        </div>
        <nav className={css(style.menuList, [style.visible, show])}>
            <ul className={style.itemList}>
                <li className={css(style.item, style.largeOnly)} {...linkTo("/me")}>
                    <MdPerson/>Home
                </li>
                <li className={style.item}>
                    <MdPerson/>Most Important
                </li>
                <li className={style.item}>
                    <MdPerson/>Second important
                </li>
                <li className={style.item}>
                    <MdPerson/>Third
                </li>
                <li className={style.item}>
                    <MdPerson/>Who even cares
                </li>
            </ul>
            <div className={style.logoutBlock}>
                {props.isLoggedIn &&
                <div className={style.item} onClick={props.logout}><MdPowerSettingsNew/>Logout</div>}
            </div>
        </nav>
        <footer className={style.bar}>
            <div onClick={() => props.notify({message: "Heyho!"}, 750)}>
                <MdChat/>
            </div>
            <Link to="/me"><MdPerson className={commonStyle.icon}/></Link>
            <div onClick={() => setShow(!show)}>{show ? <MdClose/> : <MdMenu/>}</div>
        </footer>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
