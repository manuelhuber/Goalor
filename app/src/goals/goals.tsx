import React from "react";
import {connect} from 'react-redux'
import {AppState} from "app/store";
import {addGoal, Goal} from "./duck";

interface Props {
    count: number;
    addGoal: (goal: Goal) => void;
}

const mapStateToProps = (state: AppState) => {
    return {count: state.goals.goals.length}
};

const mapDispatchToProps = {addGoal};

const Goals: React.FC<Props> = props => {

    return <div>
        <button onClick={() => props.addGoal({id: "1", title: "foo", steps: []})}>click</button>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Goals);
