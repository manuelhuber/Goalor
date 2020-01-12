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
import Modal from "app/common/Modal";

const mapStateToProps = (state: AppState, props: { goals: string[] }) => ({
    aspects: state.aspects.aspectsById,
    allGoals: state.goals.goals,
    goals: props.goals.map(id => state.goals.goals[id])
});
const mapDispatchToProps = bindActions({addGoals});
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Goals: React.FC<Props> = props => {
    const [index, setIndex] = useState(1);
    const [modalOpen, setModalOpen] = useState(true);

    const color = (goal: Goal) => props.aspects[goal.aspect] && props.aspects[goal.aspect].color;

    return <div className={styles.root}>
        <Button onClick={event => setModalOpen(true)}>open</Button>
        <Modal title={<div>What</div>}
               open={modalOpen}
               onAttemptClose={() => setModalOpen(false)}
               onConfirm={() => null}
               confirmLabel="Save">
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus ad aperiam beatae, consequuntur
                corporis deleniti distinctio dolore doloremque dolorum eum inventore magnam maxime neque, quaerat quis
                repudiandae sint voluptas voluptatem.
            </div>
        </Modal>
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
