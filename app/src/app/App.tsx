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

const mapStateToProps = (state: AppState) => {
    return {}
};

const mapDispatchToProps = {};

const App: React.FC<Props> = props => {
    return <div className={style.app}>
        <div>
            <Header/>
        </div>
        <Router>
            <Switch>
                <RestrictedRoute exact path='/me' component={Personal}/>
                <Route path='/' component={Landing}/>
                <Route component={NotFound}/>
            </Switch>
        </Router>
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(App);
