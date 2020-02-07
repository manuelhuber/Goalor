import AddRow from "app/common/AddRow";
import SectionTitle from "app/common/SectionTitle";
import Checkins from "app/features/habit/CheckIns";
import {createHabit} from "app/features/habit/duck";
import EditHabit from "app/features/habit/EditHabit";
import {AppState} from "app/Store";
import React, {useState} from "react";
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import {redDark} from "style/styleConstants";
import styled from "styled-components";

const mapStateToProps = (state: AppState) => {

    return {habits: state.habits.habits, values: state.habits.habits};
};
const mapDispatchToProps = dispatch => bindActionCreators({createHabit}, dispatch);
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Habits: React.FC<Props> = props => {
    const [showAdd, setShowAdd] = useState(false);
    let addHabit = habit => {
        props.createHabit(habit.title, habit.options);
        setShowAdd(false);
    };
    return <Root>
        <SectionTitle color={redDark} title="Habits"/>
        <Checkins/>
        <div>
            <AddRow nuxText="Add a habit that you want to track!"
                    showNux={!Object.keys(props.habits).length}
                    onAdd={() => setShowAdd(!showAdd)}/>
        </div>
        {showAdd && <EditHabit onSave={addHabit}
                               onCancel={() => setShowAdd(false)}/>}
    </Root>;
};

const Root = styled.div`
  padding:8px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Habits);
