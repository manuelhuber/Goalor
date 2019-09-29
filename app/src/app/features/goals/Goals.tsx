import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"
import {jc} from "../../../util/Style";
import SectionTitle from "../../common/SectionTitle";
import {addGoal} from "./duck";
import GoalCard from "./GoalCard";
import styles from "./Goals.module.scss";

const mapStateToProps = (state: AppState, props: { ids: string[], title: string, color: string }) => {
    return {goals: props.ids, count: props.ids.length, ...props};
};
const mapDispatchToProps = {addGoal};
let counter = 1;
const Goals: React.FC<Props> = props => {
    const addGoal = () => () => props.addGoal({
        goal: {
            id: "new" + counter++,
            title: "foo",
            steps: [{done: false, text: "step 1"}],
            image: ""
        }
    });

    return <div className={styles.goals}>
        <SectionTitle title={props.title} color={props.color}/>
        <button className={jc("button")} onClick={addGoal()}>We have {props.count}</button>
        <div className={styles.goalsWrapper}>{props.goals.map(id =>
            <div className={styles.cardWrapper} key={id}>
                <GoalCard id={id}/>
            </div>)}
        </div>
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Goals);
