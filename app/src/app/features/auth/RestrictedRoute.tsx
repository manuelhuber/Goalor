import {AppState} from "app/store";
import React from "react";
import {connect} from "react-redux"
import {Route, RouteProps} from "react-router-dom";
import {authenticate} from "./duck";

const mapStateToProps = (state: AppState, props: RouteProps & { component: new (props: any) => React.Component }) => {
    return {
        routeProps: {...props, component: null, render: null},
        component: props.component,
        canView: state.auth.authenticated
    };
};

const mapDispatchToProps = {authenticate};

const RestrictedRoute: React.FC<Props> = props => {
    const login = () => {
        props.authenticate({authenticated: true});
    };
    return <Route{...props.routeProps} render={routeProps =>
        props.canView ? (
            <props.component/>
        ) : (
            <div>
                <button onClick={login}>login</button>
                {/*<Redirect to={{*/}
                {/*    pathname: "/login",*/}
                {/*    state: {from: props.location}*/}
                {/*}}/>*/}
            </div>
        )
    }/>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(RestrictedRoute);
