import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"

const mapStateToProps = (state: AppState) => {
    return {}
};

const mapDispatchToProps = {};

const Landing: React.FC<Props> = props => {
    return <div><h1>Landing Page</h1></div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Landing);
