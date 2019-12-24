import Authenticate from "app/features/auth/Authenticate";
import Menu from "app/features/menu/Menu";
import Notifications from "app/features/notifications/Notifications";
import store from "app/Store";
import React from "react";
import {Provider} from "react-redux"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import style from "./App.module.scss";
import RestrictedRoute from "./features/auth/RestrictedRoute";
import Header from "./features/header/Header";
import Landing from "./page/Landing";
import NotFound from "./page/NotFound";
import Personal from "./page/Personal";
import {loadAllGoals} from "app/features/goals/duck";
import {loadAllAspects} from "app/features/aspects/duck";

loadAllAspects()(store.dispatch, null, null);
loadAllGoals()(store.dispatch, null, null);

const App: React.FC = () =>
    <Provider store={store}>
        <Router>
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
    </Provider>;

export default App;
