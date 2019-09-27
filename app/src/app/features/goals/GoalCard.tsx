import {AppState} from "app/store";
import React, {CSSProperties, useState} from "react";
import {connect} from "react-redux"
import {jc} from "../../../util/style";
import Checkbox from "../../common/Checkbox";
import {completeGoal, Step} from "./duck";
import styles from "./GoalCard.module.scss"

const mapStateToProps = (state: AppState, ownProps: { id: string }) => {
    return {goal: state.goals.goals[ownProps.id]}
};
const mapDispatchToProps = {completeGoal};

const GoalCard: React.FC<Props> = props => {
    const [isToggled, setToggle] = useState(false);
    if (!props.goal) {
        return <div></div>;
    }
    const {id, title, steps, image} = props.goal;

    const toggle = (step: Step, stepNumber: number, done: boolean) => {
        props.completeGoal({
            id,
            step: stepNumber,
            done: done
        });
    };

    let stepStyle: CSSProperties = {};
    if (!isToggled) {
        stepStyle["display"] = "none";
    }

    return <div className={jc(styles.card, styles.border)} style={{"backgroundImage": `url(${image})`}}>

        <div onClick={() => setToggle(!isToggled)}>
            <span className={styles.title}>{title}</span></div>

        <div className={jc(styles.steps, styles.border)} style={stepStyle}>{steps.map((step, stepNumber) => {
            const toggleStep = (done) => toggle(step, stepNumber, done);
            return <div key={stepNumber} onClick={() => toggleStep(!step.done)}>
                <Checkbox checked={step.done}/> {step.text}
            </div>
        })}
        </div>
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(GoalCard);
