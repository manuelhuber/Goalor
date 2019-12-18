import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import style from "./App.module.scss";
import RestrictedRoute from "./features/auth/RestrictedRoute";
import Header from "./features/header/Header";
import Landing from "./page/Landing";
import NotFound from "./page/NotFound";
import Personal from "./page/Personal";
import Menu from "app/features/menu/Menu";
import Authenticate from "app/features/auth/Authenticate";
import Notifications from "app/features/notifications/Notifications";

const mapStateToProps = (state: AppState) => {
    return {}
};

const mapDispatchToProps = {};

const App: React.FC<Props> = props => {
    console.log(process.env.REACT_APP_BASE_URL);
    return <Router>
        <div className={style.app}>
            <Notifications/>
            <div className={style.main}>
                <div className={style.headerWrapper}><Header/></div>
                <Switch>
                    <RestrictedRoute path='/me' component={Personal}/>
                    <Route path='/login' component={Authenticate}/>
                    <Route path='/' component={Landing}/>
                    <Route component={NotFound}/>
                </Switch>
            </div>
            <div className={style.menuWrapper}><Menu/></div>
        </div>
    </Router>
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(App);
