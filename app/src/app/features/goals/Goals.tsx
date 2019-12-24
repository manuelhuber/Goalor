import {AppState} from "app/Store";
import React, {useState} from "react";
import {connect} from "react-redux"
import {addGoals} from "./duck";
import styles from "./Goals.module.scss";
import Button from "app/common/buttons/Button";
import {css} from "util/style";
import commonStyle from "style/Common.module.scss";
import GoalCard from "app/features/goals/GoalCard";

const mapStateToProps = (state: AppState, props: { goals: string[] }) => {
    const toGoals = (ids: string[]) => ids.map(id => state.goals.goals[id]);
    return {
        allGoals: state.goals.goals,
        goals: toGoals(props.goals)
    };
};
const mapDispatchToProps = {addGoals};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const Goals: React.FC<Props> = props => {
    const [index, setIndex] = useState(1);
    return <div className={styles.root}>

        <div className={css(styles.headerRow, commonStyle.padding)}>
            <Button onClick={() => setIndex(0)}>Actions</Button>
            <Button onClick={() => setIndex(1)}>Goals</Button>
        </div>

        <div className={css(styles.goals, [styles.showActions, index === 0])}>
            {props.goals.map(goal => <div className={styles.goalRow} key={goal.id}>
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
