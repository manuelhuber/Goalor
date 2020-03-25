import {APP_TITLE} from "app/constants";
import {logout} from "app/features/auth/duck";
import Header from "app/features/header/Header";
import {notify} from "app/features/notifications/duck";
import {AppState} from "app/Store";
import React, {useState} from "react";
import {IoMdJournal, MdSync} from "react-icons/all";
import {MdChat, MdClose, MdMenu, MdPerson, MdPowerSettingsNew} from "react-icons/md";
import {connect} from "react-redux"
import {useHistory} from "react-router";
import {Link} from "react-router-dom";
import {bindActionCreators} from "redux";
import commonStyle from "style/Common.module.scss";
import {jc} from "util/style";
import style from "./Menu.module.scss";

const mapStateToProps = (state: AppState) => ({isLoggedIn: state.auth.authenticated});
const mapDispatchToProps = (dispatch) => bindActionCreators({
    notify,
    logout
}, dispatch);
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Menu: React.FC<Props> = props => {
    const [show, setShow] = useState(false);
    const history = useHistory();
    history.listen(_ => setShow(false));
    const linkTo = (url: string) => ({onClick: () => history.push(url)});

    return <div className={style.root}>
        <div className={style.header}>
            <Header>{APP_TITLE}</Header>
        </div>
        <nav className={jc(style.menuList, [style.visible, show])}>
            <ul className={style.itemList}>
                <li className={jc(style.item, style.largeOnly)} {...linkTo("/me")}>
                    <MdPerson/>Home
                </li>
                <li className={style.item} {...linkTo("/journal")}>
                    <IoMdJournal/>Journal
                </li>
                <li className={style.item} {...linkTo("/habits")}>
                    <MdSync/>Habits
                </li>
                <li className={style.item} {...linkTo("/settings")}>
                    <MdPerson/>Account
                </li>
            </ul>
            <div className={style.logoutBlock}>
                {props.isLoggedIn ?
                    <div className={style.item} onClick={props.logout}><MdPowerSettingsNew/>Logout</div>
                    : <div className={style.item} {...linkTo("/me")}><MdPowerSettingsNew/>Login</div>
                }
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
