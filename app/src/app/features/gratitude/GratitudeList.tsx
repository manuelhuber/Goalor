import React from "react";
import {connect} from 'react-redux'
import {AppState} from "app/Store";

const mapStateToProps = (state: AppState) => {
    return {

    }
};

const mapDispatchToProps = {};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const GratitudeList: React.FC<Props> = props => {

    return <div></div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(GratitudeList);
