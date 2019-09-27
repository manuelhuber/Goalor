import {AppState} from "app/store";
import React from "react";
import {connect} from "react-redux"
import {addGoal} from "./duck";
import GoalCard from "./GoalCard";
import styles from "./Goals.module.scss";

const mapStateToProps = (state: AppState) => {
    return {count: state.goals.ids.length, goals: state.goals}
};
const mapDispatchToProps = {addGoal};

const Goals: React.FC<Props> = props => {
    const addGoal = () => () => props.addGoal({goal: {id: "asdfasd", title: "foo", steps: [], image: ""}});

    return <div className={styles.goals}>
        <div className={styles.title}>My Goals <hr className={styles.titleLine}/></div>
        <button onClick={addGoal()}>We have {props.count}</button>
        <div className={styles.goalsWrapper}>{props.goals.ids.map(id =>
            <div className={styles.cardWrapper} key={id}>
                <GoalCard id={id}/>
            </div>)}
        </div>
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Goals);
