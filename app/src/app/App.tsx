import {AppState} from "app/store";
import React from "react";
import {connect} from "react-redux"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import style from "./App.module.scss";
import Header from "./features/header/Header";
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
                {/* Use 'render' to pass addition props otherwise use 'component'*/}
                <Route exact path='/me' render={props => <Personal {...props} allGood={true}/>}/>
                <Route component={NotFound}/>
            </Switch>
        </Router>
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(App);
