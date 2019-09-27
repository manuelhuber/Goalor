import {AppState} from "app/store";
import React from "react";
import {connect} from "react-redux"
import Goals from "../goals/Goals";
import Header from "../header/Header";

const mapStateToProps = (state: AppState) => {
    return {}
};

const mapDispatchToProps = {};

const App: React.FC<Props> = props => {
    return <div>
        <div>
            <Header/>
        </div>
        <Goals/>
    </div>;
};

type DispatchProps = typeof mapDispatchToProps;
type StateMapProps = ReturnType<typeof mapStateToProps>
type Props = DispatchProps & StateMapProps;
export default connect(mapStateToProps, mapDispatchToProps)(App);
