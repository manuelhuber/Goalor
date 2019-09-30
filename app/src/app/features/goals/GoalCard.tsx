import {AppState} from "app/Store";
import React, {useState} from "react";
import {connect} from "react-redux"
import {jc} from "../../../util/Style";
import Barometer from "./Barometer";
import styles from "./GoalCard.module.scss"

const mapStateToProps = (state: AppState, ownProps: { id: string }) => {
    return {goal: state.goals.goals[ownProps.id]}
};
const mapDispatchToProps = {};

const GoalCard: React.FC<Props> = props => {
    const [isToggled, setToggle] = useState(false);
    const {id, title, steps, image} = props.goal;


    return <div className={jc(styles.card, styles.border)} style={{"backgroundImage": `url(${image})`}}>
        <div onClick={() => setToggle(!isToggled)}><h6 className={styles.title}>{title}</h6></div>
        {isToggled && <div className={jc(styles.steps, styles.border)}><Barometer steps={steps} goalId={id}/></div>}
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(GoalCard);
