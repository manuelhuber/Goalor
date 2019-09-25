import {AppState} from "app/store";
import React from "react";
import {connect} from 'react-redux'
import {addGoal} from "./duck";

const mapStateToProps = (state: AppState) => {
    return {count: state.goals.length, bar: state.foo}
};
const mapDispatchToProps = {addGoal};

const Goals: React.FC<Props> = props => {
    return <div>
        <button onClick={() => props.addGoal({id: "1", title: "foo", steps: []})}>We have {props.count}</button>
    </div>;
};

type DispatchProps = typeof mapDispatchToProps;
type StateMapProps = ReturnType<typeof mapStateToProps>
type Props = DispatchProps & StateMapProps;
export default connect(mapStateToProps, mapDispatchToProps)(Goals);
