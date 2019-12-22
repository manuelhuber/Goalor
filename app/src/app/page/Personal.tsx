import Expandable from "app/common/Expandable";
import SectionTitle from "app/common/SectionTitle";
import Aspects from "app/features/aspects/Aspects";
import Filter from "app/features/filter/Filter";
import {ACTIVE_GOALS_NAMESPACE, MAYBE_SOMEDAY_NAMESPACE} from "app/features/goals/duck";
import Goals from "app/features/goals/Goals";
import {AppState} from "app/Store";
import React, {useState} from "react";
import {connect} from "react-redux"
import {green, redDark} from "style/styleConstants";

const mapStateToProps = (state: AppState) => {
    const toGoals = (ids: string[]) => ids.map(id => state.goals.goals[id]);
    return {
        personalGoals: toGoals(state.goals.activeFiltered),
        personalFilters: state.goals.activeFilters,
        maybeSomeday: toGoals(state.goals.maybeSomedayFiltered),
        maybeFilters: state.goals.maybeSomedayFilters,
    };
};
const mapDispatchToProps = {};
type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const Personal: React.FC<Props> = props => {
    const [isPersonalFilterOpen, setPersonalFilterOpen] = useState(false);
    const [isMaybeFiltersOpen, setMaybeFiltersOpen] = useState(false);
    return <div style={{padding: "5px"}}>
        <SectionTitle title="Aspects" color={redDark}/>
        <Aspects/>
        <SectionTitle title="My Goals" color={redDark}/>
        <Expandable expanded={isPersonalFilterOpen} onChange={open => setPersonalFilterOpen(open)} label="Filters">
            <Filter filters={props.personalFilters} namespace={ACTIVE_GOALS_NAMESPACE}/>
        </Expandable>
        <Goals goals={props.personalGoals}/>

        <SectionTitle title="Maybe Someday" color={green}/>
        <Expandable expanded={isMaybeFiltersOpen} onChange={open => setMaybeFiltersOpen(open)} label="Filters">
            <Filter filters={props.maybeFilters} namespace={MAYBE_SOMEDAY_NAMESPACE}/>
        </Expandable>
        <Goals goals={props.maybeSomeday}/>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Personal);
