import React from 'react';
import logo from '../logo.svg';
import './App.css';
import {connect} from "react-redux";
import Goals from "../goals/goals";
import {AppState} from "./store";

interface Props {
    count: number;
}

const App: React.FC<Props> = (props) => {
    return (
        <div className="App">
            <header className="App-header">
                FOO: {props.count}
                <Goals/>
                <img src={logo} className="App-logo" alt="logo"/>
                <p>Edit <code>src/App.tsx</code> and save to reload.</p>
                <a className="App-link"
                   href="https://reactjs.org"
                   target="_blank"
                   rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
        </div>
    );
};

const mapStateToProps = (state: AppState): Props => {
    return {
        count: state.goals.goals.length
    }
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
