import SectionTitle from "app/common/SectionTitle";
import Checkins from "app/features/habit/CheckIns";
import {AppState} from "app/Store";
import React from "react";
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import {redDark} from "style/styleConstants";
import styled from "styled-components";

const mapStateToProps = (state: AppState) => {

    return {habits: state.habits.habits, values: state.habits.habits};
};
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Habits: React.FC<Props> = props => {
    return <Root>
        <SectionTitle color={redDark} title="Habits"/>
        <Checkins/>
    </Root>;
};

const Root = styled.div`
  padding:8px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Habits);
