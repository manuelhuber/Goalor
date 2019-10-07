import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"
import {green, redDark} from "../../style/styleConstants";
import {filterGoals} from "../features/filter/duck";
import Filter from "../features/filter/Filter";
import {addGoal} from "../features/goals/duck";
import Goals from "../features/goals/Goals";

const mapStateToProps = (state: AppState, otherProps: { allGood: boolean }) => {
    const toGoals = (ids: string[]) => ids.map(id => state.goals.goals[id]);
    const personal = filterGoals(state.filters, toGoals(state.goals.active));
    const maybe = filterGoals(state.filters, toGoals(state.goals.maybeSomeday));
    console.log(personal);

    return {...otherProps, personalGoals: personal, maybeSomeday: maybe};

};
const mapDispatchToProps = {addGoal};

const Personal: React.FC<Props> = props => {
    return <div>
        <Filter/>
        <Goals goals={props.personalGoals} title='My Goals' color={redDark}/>
        <Goals goals={props.maybeSomeday} title='Maybe Someday' color={green}/>
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Personal);
