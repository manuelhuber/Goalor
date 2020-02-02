import AddRow from "app/common/AddRow";
import IconButton from "app/common/buttons/IconButton";
import EditGoal from "app/features/goals/EditGoal";
import GoalCard from "app/features/goals/GoalCard";
import {AppState} from "app/Store";
import {Goal} from "generated/models";
import React, {useState} from "react";
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from "react-icons/all";
import {connect} from "react-redux"
import commonStyle from "style/Common.module.scss";
import {bindActions} from "util/duckUtil";
import {jc} from "util/style";
import {addGoals, updateGoal} from "./duck";
import styles from "./Goals.module.scss";

const mapStateToProps = (state: AppState, props: { rootGoals: string[] }) => ({
    aspects: state.aspects.aspectsById,
    allAspects: Object.values(state.aspects.aspectsById),
    allGoals: state.goals.goalsById,
    rootGoals: props.rootGoals.map(id => state.goals.goalsById[id])
});
const mapDispatchToProps = bindActions({addGoals, updateGoal});
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Goals: React.FC<Props> = props => {
    const numOfCols = 2;
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [onSave, setOnSave] = useState(() => () => null);
    const [goalInEdit, setGoalInEdit] = useState(null);
    const [selectedCol, setSelectedCol] = useState(numOfCols - 1);
    const toggleAddNew = () => {
        setModalTitle("Create Goal");
        setOnSave(() => (goal) => {
            props.addGoals(goal);
            setModalOpen(false);
        });
        setGoalInEdit(null);
        setModalOpen(true);
    };
    const toggleEdit = (goal) => {
        setModalTitle("Edit Goal");
        setOnSave(() => (goal) => {
            props.updateGoal(goal);
            setModalOpen(false);
        });
        setGoalInEdit(goal);
        setModalOpen(true);
    };

    const color = (goal: Goal) => props.aspects[goal.aspect] && props.aspects[goal.aspect].color;

    return <div className={styles.root}>
        <EditGoal title={modalTitle}
            // Key to re-instantiate EditGoal on goalInEdit change
                  key={goalInEdit && goalInEdit.id}
                  open={modalOpen}
                  goal={goalInEdit}
                  aspects={props.allAspects}
                  potentialParents={props.rootGoals.filter(goal => !goalInEdit || goal.id !== goalInEdit.id)}
                  onAttemptClose={() => setModalOpen(false)}
                  onSave={onSave}/>
        <AddRow onAdd={toggleAddNew} showNux={!Object.keys(props.allGoals).length} nuxText="Add a goal."/>
        <div className={jc(styles.headerRow, commonStyle.padding)}>
            <IconButton onClick={() => setSelectedCol(selectedCol - 1)} disabled={selectedCol <= 0}>
                <MdKeyboardArrowLeft/>
            </IconButton>
            <IconButton onClick={() => setSelectedCol(selectedCol + 1)} disabled={selectedCol >= numOfCols - 1}>
                <MdKeyboardArrowRight/>
            </IconButton>
        </div>
        <div className={jc(styles.goals)}
             style={{width: `${numOfCols * 100}%`, transform: `translateX(-${(selectedCol / numOfCols) * 100}%)`}}>
            {props.rootGoals.map(goal => <div className={styles.goalRow}
                                              style={{borderColor: color(goal)}}
                                              key={goal.id}>
                <div className={styles.actionColumn}>
                    {goal.children
                         .map(id => props.allGoals[id])
                         .filter(goal => !!goal) // filter out bad references
                         .map((x, i) =>
                             <GoalCard key={`${goal.id}-${i}`} goal={x} onEdit={toggleEdit}/>)}
                </div>
                <div className={styles.goalColumn}>
                    <GoalCard goal={goal} onEdit={toggleEdit}/>
                </div>
            </div>)}
        </div>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Goals);
