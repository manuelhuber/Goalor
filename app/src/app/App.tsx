import {APP_TITLE} from "app/constants";
import {loadAllAspects} from "app/features/aspects/duck";
import Authenticate from "app/features/auth/Authenticate";
import {loadAllGoals} from "app/features/goals/duck";
import {loadAllGratitudes} from "app/features/gratitude/duck";
import Menu from "app/features/menu/Menu";
import Notifications from "app/features/notifications/Notifications";
import Journal from "app/page/Journal";
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

if (store.getState().auth.authenticated) {
    // @ts-ignore
    loadAllAspects()(store.dispatch, null, null);
    // @ts-ignore
    loadAllGoals()(store.dispatch, null, null);
    // @ts-ignore
    loadAllGratitudes()(store.dispatch, null, null);
}

const App: React.FC = () =>
    <Provider store={store}>
        <Router>
            <div className={style.app}>
                <Notifications/>
                <div className={style.main}>
                    <Header>
                        <div className={style.header}>{APP_TITLE}</div>
                    </Header>
                    <div>
                        <Switch>
                            <RestrictedRoute path='/me' component={Personal}/>
                            <RestrictedRoute path='/journal' component={Journal}/>
                            <Route path='/login' component={Authenticate}/>
                            <Route path='/' exact component={Landing}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </div>
                </div>
                <div className={style.menuWrapper}><Menu/></div>
            </div>
        </Router>
    </Provider>;

export default App;
