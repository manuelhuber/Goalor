import {AppState} from "app/store";
import React from "react";
import {connect} from 'react-redux'
import {addGoal} from "./duck";
import GoalCard from "./GoalCard";

const mapStateToProps = (state: AppState) => {
    return {count: state.goals.ids.length, goals: state.goals}
};
const mapDispatchToProps = {addGoal};

const Goals: React.FC<Props> = props => {
    const addGoal = () => () => props.addGoal({goal: {id: 'asdfasd', title: "foo", steps: []}});

    return <div>
        <button onClick={addGoal()}>We have {props.count}</button>
        {props.goals.ids.map(id => <GoalCard key={id} id={id}/>)}
        <div className="Appheader">Test</div>
    </div>;
};

type DispatchProps = typeof mapDispatchToProps;
type StateMapProps = ReturnType<typeof mapStateToProps>
type Props = DispatchProps & StateMapProps;
export default connect(mapStateToProps, mapDispatchToProps)(Goals);
