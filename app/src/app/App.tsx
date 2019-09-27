import {AppState} from "app/store";
import React from "react";
import {connect} from "react-redux"
import Goals from "./features/goals/Goals";
import Header from "./features/header/Header";
import style from "./App.module.scss";

const mapStateToProps = (state: AppState) => {
    return {}
};

const mapDispatchToProps = {};

const App: React.FC<Props> = props => {
    return <div className={style.app}>
        <div>
            <Header/>
        </div>
        <Goals/>
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(App);
