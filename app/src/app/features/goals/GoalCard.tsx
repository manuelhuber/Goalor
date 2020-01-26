import commonStyle from "style/Common.module.scss";
import {AppState} from "app/Store";
import React, {useState} from "react";
import {connect} from "react-redux"
import {jc} from "util/style";
import styles from "./GoalCard.module.scss"
import {Goal} from "generated/models";
import {MdDelete, MdEdit, MdExpandLess, MdExpandMore} from "react-icons/all";
import Checkbox from "app/common/input/Checkbox";
import {deleteGoal, updateGoal} from "app/features/goals/duck";
import {bindActions} from "util/duckUtil";
import {clone} from "util/object";
import PopupMenu from "app/common/PopupMenu";

const mapStateToProps = (state: AppState, ownProps: { goal: Goal, onEdit?: (Goal) => void }) => ownProps;
const mapDispatchToProps = bindActions({
    updateGoal,
    deleteGoal
});
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const GoalCard: React.FC<Props> = props => {
    const [isToggled, setToggle] = useState(false);
    const {goal} = props;
    const hasContent = !!goal.description;
    return <div className={jc(styles.card, styles.border)}>
        <div className={styles.titleRow}>
            <div className={styles.title}>
                <Checkbox checked={goal.done}
                          onChange={newValue => props.updateGoal(clone(goal, {done: newValue}))}
                          label={goal.title}
                          noMargin={true}
                          inline={true}/>
                {hasContent && <span onClick={() => setToggle(!isToggled)} className={commonStyle.clickable}>
                    {isToggled ? <MdExpandLess/> : <MdExpandMore/>}
                </span>}
            </div>
            <PopupMenu entries={[
                {icon: <MdEdit/>, text: "Edit", onClick: () => props.onEdit(props.goal)},
                {icon: <MdDelete/>, text: "Delete", onClick: () => props.deleteGoal(props.goal.id)}
            ]}/>
        </div>
        {isToggled && <div>
            <div className={commonStyle.divider}/>
            <div>{goal.description}</div>
        </div>}
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(GoalCard);
