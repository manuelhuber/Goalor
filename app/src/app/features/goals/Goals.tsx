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
import {bindActions} from "util/duckUtil";
import EditGoal from "app/features/goals/EditGoal";

const mapStateToProps = (state: AppState, props: { rootGoals: string[] }) => ({
    aspects: state.aspects.aspectsById,
    allAspects: Object.values(state.aspects.aspectsById),
    allGoals: state.goals.goalsById,
    rootGoals: props.rootGoals.map(id => state.goals.goalsById[id])
});
const mapDispatchToProps = bindActions({addGoals});
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Goals: React.FC<Props> = props => {
    const [index, setIndex] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [onSave, setOnSave] = useState(() => () => null);
    const toggleAddNew = () => {
        setModalTitle("Create Goal");
        setOnSave(() => (goal) => {
            props.addGoals(goal);
            setModalOpen(false);
        });
        setModalOpen(true);
    };

    const color = (goal: Goal) => props.aspects[goal.aspect] && props.aspects[goal.aspect].color;

    return <div className={styles.root}>
        <Button onClick={toggleAddNew}>Add Goal</Button>
        <EditGoal title={modalTitle}
                  open={modalOpen}
                  aspects={props.allAspects}
                  potentialParents={props.rootGoals}
                  onAttemptClose={() => setModalOpen(false)}
                  onSave={onSave}/>
        <div className={css(styles.headerRow, commonStyle.padding)}>
            <Button onClick={() => setIndex(0)}>Actions</Button>
            <Button onClick={() => setIndex(1)}>Goals</Button>
        </div>

        <div className={css(styles.goals, [styles.showActions, index === 0])}>
            {props.rootGoals.map(goal => <div className={styles.goalRow}
                                              style={{borderColor: color(goal)}}
                                              key={goal.id}>
                <div className={styles.actionColumn}>
                    {goal.children
                         .map(id => props.allGoals[id])
                         .filter(goal => !!goal) // filter out bad references
                         .map((x, i) => <GoalCard key={`${goal.id}-${i}`} goal={x}/>)}
                </div>
                <div className={styles.goalColumn}>
                    <GoalCard goal={goal}/>
                </div>
            </div>)}
        </div>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Goals);
