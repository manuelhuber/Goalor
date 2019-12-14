import React from "react";
import {connect} from 'react-redux'
import {AppState} from "app/Store";

const mapStateToProps = (state: AppState) => {
    return {}
};

const mapDispatchToProps = {};

const Menu: React.FC<Props> = props => {
    
    return <div></div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Menu);
