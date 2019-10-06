import {AppState} from "app/store";
import React from "react";
import {connect} from "react-redux"
import {Route, RouteProps} from "react-router-dom";
import Authenticate from "./Authenticate";

const mapStateToProps = (state: AppState, props: RouteProps & { component: new (props: any) => React.Component }) => {
    return {
        routeProps: {...props, component: null, render: null},
        component: props.component,
        canView: state.auth.authenticated
    };
};
const mapDispatchToProps = {};

const RestrictedRoute: React.FC<Props> = props => {
    return <Route{...props.routeProps} render={routeProps =>
        props.canView ? (
            <props.component/>
        ) : (
            <div>
                <Authenticate/>
            </div>
        )
    }/>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(RestrictedRoute);
