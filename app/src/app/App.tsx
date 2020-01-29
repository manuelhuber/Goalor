import {APP_TITLE} from "app/constants";
import Authenticate from "app/features/auth/Authenticate";
import {DataFetchers} from "app/features/auth/duck";
import Menu from "app/features/menu/Menu";
import Notifications from "app/features/notifications/Notifications";
import Journal from "app/page/Journal";
import Reset from "app/page/Reset";
import Settings from "app/page/Settings";
import store from "app/Store";
import React from "react";
import {Provider} from "react-redux"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import styled from "styled-components";
import style from "./App.module.scss";
import RestrictedRoute from "./features/auth/RestrictedRoute";
import Header from "./features/header/Header";
import Landing from "./page/Landing";
import NotFound from "./page/NotFound";
import Personal from "./page/Personal";

if (store.getState().auth.authenticated) {
    DataFetchers.forEach(thunk => thunk(store.dispatch, null, null));
}

const App: React.FC = () =>
    <Provider store={store}>
        <Router>
            <div className={style.app}>
                <Notifications/>
                <Main>
                    <Header>
                        <div className={style.header}>{APP_TITLE}</div>
                    </Header>
                    <Content>
                        <Switch>
                            <RestrictedRoute path='/me' component={Personal}/>
                            <RestrictedRoute path='/journal' component={Journal}/>
                            <RestrictedRoute path='/settings' component={Settings}/>
                            <Route path='/login' component={Authenticate}/>
                            <Route path='/reset/:token' component={Reset}/>
                            <Route path='/' exact component={Landing}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </Content>
                </Main>
                <div className={style.menuWrapper}><Menu/></div>
            </div>
        </Router>
    </Provider>;

export default App;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;
const Main = styled.div`
  flex-grow: 1;
  overflow: auto;
`;
