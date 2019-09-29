import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"
import {green, redDark} from "../../style/styleConstants";
import Goals from "../features/goals/Goals";

const mapStateToProps = (state: AppState, otherProps: { allGood: boolean }) => {
    return {
        ...otherProps, personalGoals: state.goals.ids
    }
};
const mapDispatchToProps = {};

const Personal: React.FC<Props> = props => {
    console.log(props);
    return <div>
        <Goals ids={props.personalGoals} title='My Goals' color={redDark}/>
        <Goals ids={[]} title='Maybe Someday' color={green}/>
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Personal);
