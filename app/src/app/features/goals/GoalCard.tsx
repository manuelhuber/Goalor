import {AppState} from "app/Store";
import React, {CSSProperties, useState} from "react";
import {connect} from "react-redux"
import {jc} from "../../../util/style";
import Barometer from "./Barometer";
import styles from "./GoalCard.module.scss"

const mapStateToProps = (state: AppState, ownProps: { id: string }) => {
    return {goal: state.goals.goals[ownProps.id]}
};
const mapDispatchToProps = {};

const GoalCard: React.FC<Props> = props => {
    const [isToggled, setToggle] = useState(false);
    const {id, title, steps, image} = props.goal;

    let stepStyle: CSSProperties = {};

    return <div className={jc(styles.card, styles.border)} style={{"backgroundImage": `url(${image})`}}>

        <div onClick={() => setToggle(!isToggled)}>
            <span className={styles.title}>{title}</span></div>

        {isToggled && <div className={jc(styles.steps, styles.border)} style={stepStyle}>
            <Barometer steps={steps} goalId={id}/>
        </div>}
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(GoalCard);
