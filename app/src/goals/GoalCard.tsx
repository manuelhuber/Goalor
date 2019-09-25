import {AppState} from "app/store";
import React from "react";
import {connect} from 'react-redux'
import {completeGoal, Step} from "./duck";

const mapStateToProps = (state: AppState, ownProps: { id: string }) => {
    return {goal: state.goals.goals[ownProps.id]}
};
const mapDispatchToProps = {completeGoal};

const GoalCard: React.FC<Props> = props => {
    if (!props.goal) {return <div></div>; }
    const {id, title, steps} = props.goal;

    const toggle = (step: Step, stepNumber: number) => () => props.completeGoal({
        id,
        step: stepNumber,
        done: !step.done
    });

    return <div>
        <div>{title}</div>
        <div>{steps.map((step, stepNumber) =>
            <div onClick={toggle(step, stepNumber)}>{step.text} - {step.done ? 'Done' : 'Open'}</div>)}
        </div>
    </div>;
};

type DispatchProps = typeof mapDispatchToProps;
type StateMapProps = ReturnType<typeof mapStateToProps>
type Props = DispatchProps & StateMapProps;
export default connect(mapStateToProps, mapDispatchToProps)(GoalCard);
