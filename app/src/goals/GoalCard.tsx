import {AppState} from "app/store";
import React from "react";
import {connect} from "react-redux"
import {completeGoal, Step} from "./duck";
import styles from "./GoalCard.module.scss"

const mapStateToProps = (state: AppState, ownProps: { id: string }) => {
    return {goal: state.goals.goals[ownProps.id]}
};
const mapDispatchToProps = {completeGoal};

const GoalCard: React.FC<Props> = props => {
    if (!props.goal) {
        return <div></div>;
    }
    const {id, title, steps, image} = props.goal;

    const toggle = (step: Step, stepNumber: number) => () => props.completeGoal({
        id,
        step: stepNumber,
        done: !step.done
    });

    return <div className={styles.card} style={{"backgroundImage": `url(${image})`}}>
        <div><span className={styles.title}>{title}</span></div>
        {/*<div>{steps.map((step, stepNumber) =>
            <div key={stepNumber} onClick={toggle(step, stepNumber)}>
                {step.text} - {step.done ? 'Done' : 'Open'}
            </div>)}
        </div>*/}
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(GoalCard);
