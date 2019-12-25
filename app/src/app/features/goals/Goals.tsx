import {AppState} from "app/Store";
import React, {useState} from "react";
import {connect} from "react-redux"
import {addGoals} from "./duck";
import styles from "./Goals.module.scss";
import Button from "app/common/buttons/Button";
import {css} from "util/style";
import commonStyle from "style/Common.module.scss";
import GoalCard from "app/features/goals/GoalCard";
import {Goal} from "generated/models";

const mapStateToProps = (state: AppState, props: { goals: string[] }) => ({
    aspects: state.aspects.aspectsById,
    allGoals: state.goals.goals,
    goals: props.goals.map(id => state.goals.goals[id])
});
const mapDispatchToProps = {addGoals};
type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const Goals: React.FC<Props> = props => {
    const [index, setIndex] = useState(1);

    const color = (goal: Goal) => props.aspects[goal.aspect] && props.aspects[goal.aspect].color;

    return <div className={styles.root}>

        <div className={css(styles.headerRow, commonStyle.padding)}>
            <Button onClick={() => setIndex(0)}>Actions</Button>
            <Button onClick={() => setIndex(1)}>Goals</Button>
        </div>

        <div className={css(styles.goals, [styles.showActions, index === 0])}>
            {props.goals.map(goal => <div className={styles.goalRow}
                                          style={{borderColor: color(goal)}}
                                          key={goal.id}>
                <div className={styles.actionColumn}>
                    {goal.children
                         .map(id => props.allGoals[id])
                         .filter(goal => !!goal) // filter out bad references
                         .map((x, i) => <GoalCard key={`${goal.id}-${i}`} title={x.title}/>)}
                </div>
                <div className={styles.goalColumn}>
                    <GoalCard title={goal.title}/>
                </div>
            </div>)}
        </div>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Goals);
