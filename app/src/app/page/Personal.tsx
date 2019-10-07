import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"
import {green, redDark} from "style/styleConstants";
import Filter from "../features/filter/Filter";
import {addGoal} from "../features/goals/duck";
import Goals from "../features/goals/Goals";

const mapStateToProps = (state: AppState, otherProps: { allGood: boolean }) => {
    const toGoals = (ids: string[]) => ids.map(id => state.goals.goals[id]);

    return {
        ...otherProps,
        personalGoals: toGoals(state.goals.activeFiltered),
        personalFilters: state.goals.activeFilters,
        maybeSomeday: toGoals(state.goals.maybeSomedayFiltered),
        maybeFilters: state.goals.maybeSomedayFilters,
    };

};
const mapDispatchToProps = {addGoal};

const Personal: React.FC<Props> = props => {
    return <div>
        <div>ACTIVE:</div>
        <Filter filters={props.personalFilters} namespace='ACTIVE_GOALS'/>
        <div>MAYBE:</div>
        <Filter filters={props.maybeFilters} namespace='MAYBE_GOALS'/>
        <Goals goals={props.personalGoals} title='My Goals' color={redDark}/>
        <Goals goals={props.maybeSomeday} title='Maybe Someday' color={green}/>
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Personal);
