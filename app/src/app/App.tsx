import {APP_TITLE} from "app/constants";
import {DataFetchers} from "app/features/auth/duck";
import Menu from "app/features/menu/Menu";
import Notifications from "app/features/notifications/Notifications";
import Habits from "app/page/Habits";
import Journal from "app/page/Journal";
import Reset from "app/page/Reset";
import Settings from "app/page/Settings";
import store from "app/Store";
import React from "react";
import {Provider} from "react-redux"
import {Route, Switch, useHistory} from "react-router";
import {BrowserRouter as Router} from "react-router-dom";
import commonStyle from "style/Common.module.scss";
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

const App: React.FC = () => {
    return <Provider store={store}>
        <Router>
            <div className={style.app}>
                <Notifications/>
                <Main>
                    <MainHeader/>
                    <Content>
                        <Switch>
                            <RestrictedRoute path='/me' component={Personal}/>
                            <RestrictedRoute path='/journal' component={Journal}/>
                            <RestrictedRoute path='/settings' component={Settings}/>
                            <RestrictedRoute path='/habits' component={Habits}/>
                            <Route path='/reset/:username/:token' component={Reset}/>
                            <Route path='/' exact component={Landing}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </Content>
                </Main>
                <div className={style.menuWrapper}><Menu/></div>
            </div>
        </Router>
    </Provider>;
};

// Need component inside Router to useHistory
const MainHeader: React.FC = () => {
    const history = useHistory();
    return <Header>
        <div className={style.header}>
            <span className={commonStyle.clickable} onClick={() => history.push("/")}>{APP_TITLE}</span>
        </div>
    </Header>

};

export default App;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;
const Main = styled.div`
  flex-grow: 1;
  overflow: auto;
`;
