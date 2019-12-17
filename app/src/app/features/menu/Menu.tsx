import React, {useState} from "react";
import {connect} from "react-redux"
import {AppState} from "app/Store";
import style from "./Menu.module.scss";
import commonStyle from "style/Common.module.scss";
import {css} from "util/style";
import {Link} from "react-router-dom";
import {FaUser,} from "react-icons/fa";
import {MdMenu, MdClose} from "react-icons/md";

const mapStateToProps = (state: AppState) => {
    return {}
};
const mapDispatchToProps = {};
type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const Menu: React.FC<Props> = props => {
    const [show, setShow] = useState(false);


    return <div className={style.root}>
        <div className={css(style.list, [style.visible, show])}>
            {[1, 2, 3, 4, 5].map(x => <div key={x}>x</div>)}
        </div>
        <div className={style.bar}>
            <div>Something</div>
            <Link to="/me"><FaUser className={commonStyle.icon}/></Link>
            <div onClick={() => setShow(!show)}>{show ? <MdClose/> : <MdMenu/>}</div>
        </div>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
