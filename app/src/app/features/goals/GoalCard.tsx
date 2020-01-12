import commonStyle from "style/Common.module.scss";
import {AppState} from "app/Store";
import React, {useState} from "react";
import {connect} from "react-redux"
import {css} from "util/style";
import styles from "./GoalCard.module.scss"
import {Goal} from "generated/models";
import {MdExpandLess, MdExpandMore, MdMoreVert} from "react-icons/all";
import Checkbox from "app/common/input/Checkbox";
import {updateGoal} from "app/features/goals/duck";
import {bindActions} from "util/duckUtil";
import {clone} from "util/object";

const mapStateToProps = (state: AppState, ownProps: { goal: Goal }) => ownProps;
const mapDispatchToProps = bindActions({
    updateGoal
});
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const GoalCard: React.FC<Props> = props => {
    const [isToggled, setToggle] = useState(false);
    const {goal} = props;
    const hasContent = !!goal.description;
    return <div className={css(styles.card, styles.border)}>
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
            <MdMoreVert/>
        </div>
        {isToggled && <div>
            <div className={commonStyle.divider}/>
            <div>{goal.description}</div>
        </div>}
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(GoalCard);
