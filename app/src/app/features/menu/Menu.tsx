import {logout} from "app/features/auth/duck";
import {notify} from "app/features/notifications/duck";
import {AppState} from "app/Store";
import React, {useState} from "react";
import {FaUser,} from "react-icons/fa";
import {MdChat, MdClose, MdMenu} from "react-icons/md";
import {connect} from "react-redux"
import {Link} from "react-router-dom";
import {bindActionCreators} from "redux";
import commonStyle from "style/Common.module.scss";
import {css} from "util/style";
import style from "./Menu.module.scss";

const mapStateToProps = (state: AppState) => {
    return {}
};
const mapDispatchToProps = (dispatch) => bindActionCreators({
    notify,
    logout
}, dispatch);
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Menu: React.FC<Props> = props => {
    const [show, setShow] = useState(false);
    return <div className={style.root}>
        <div className={css(style.list, [style.visible, show])}>
            <div onClick={props.logout}>Logout</div>
        </div>
        <div className={style.bar}>
            <div onClick={event => props.notify({message: "Heyho!"}, 750)}>
                <MdChat/>
            </div>
            <Link to="/me"><FaUser className={commonStyle.icon}/></Link>
            <div onClick={() => setShow(!show)}>{show ? <MdClose/> : <MdMenu/>}</div>
        </div>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
