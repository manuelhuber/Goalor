import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"
import SectionTitle from "../../common/SectionTitle";
import {createGoal} from "./duck";
import GoalCard from "./GoalCard";
import styles from "./Goals.module.scss";

const mapStateToProps = (state: AppState, props: { ids: string[], title: string, color: string }) => {
    return {goals: props.ids, count: props.ids.length, ...props};
};
const mapDispatchToProps = {addGoal: createGoal};

const Goals: React.FC<Props> = props => {
    return <div className={styles.goals}>
        <SectionTitle title={props.title} color={props.color}/>
        <div className={styles.goalsWrapper}>{props.goals.map(id =>
            <div className={styles.cardWrapper} key={id}>
                <GoalCard id={id}/>
            </div>)}
        </div>
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Goals);
