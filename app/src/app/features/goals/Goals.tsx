import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"
import {createGoal, Goal} from "./duck";
import GoalCard from "./GoalCard";
import styles from "./Goals.module.scss";

const mapStateToProps = (state: AppState, props: { goals: Goal[] }) => {
    return {goals: props.goals, count: props.goals.length, ...props};
};
const mapDispatchToProps = {addGoal: createGoal};

const Goals: React.FC<Props> = props => {
    return <div className={styles.goals}>
        <div className={styles.goalsWrapper}>{props.goals.map(goal =>
            <div className={styles.cardWrapper} key={goal.id}><GoalCard goal={goal}/></div>)}
        </div>
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Goals);
