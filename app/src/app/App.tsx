import React from "react";
import {connect} from 'react-redux'
import {AppState} from "app/store";
import Goals from "../goals/Goals";
import styles from './App.module.scss';

const mapStateToProps = (state: AppState) => {
    return {}
};

const mapDispatchToProps = {};

const App: React.FC<Props> = props => {
    return <div>
        <div className={styles.Appheader}>a</div>
        <div>foo</div>
        <Goals/>
    </div>;
};

type DispatchProps = typeof mapDispatchToProps;
type StateMapProps = ReturnType<typeof mapStateToProps>
type Props = DispatchProps & StateMapProps;
export default connect(mapStateToProps, mapDispatchToProps)(App);
