import SectionTitle from "app/common/SectionTitle";
import Aspects from "app/features/aspects/Aspects";
import Goals from "app/features/goals/Goals";
import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"
import {redDark} from "style/styleConstants";
import commonStyle from "style/Common.module.scss";

const mapStateToProps = (state: AppState) => {
    return {
        rootGoals: Object.values(state.goals.goals).filter(goal => !goal.parent).map(goal => goal.id)
    };
};
const mapDispatchToProps = {};
type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const Personal: React.FC<Props> = props => {
    return <div>
        <div className={commonStyle.padding}><SectionTitle title="Aspects" color={redDark}/></div>
        <Aspects/>
        <div className={commonStyle.padding}><SectionTitle title="My Goals" color={redDark}/></div>
        <Goals goals={props.rootGoals}/>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Personal);
