import IconButton from "app/common/buttons/IconButton";
import Input from "app/common/input/Input";
import CheckIn from "app/features/habit/CheckIn";
import {setHabitValue} from "app/features/habit/duck";
import {AppState} from "app/Store";
import React, {useState} from "react";
import {IoMdArrowDropleft, IoMdArrowDropright} from "react-icons/all";
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import styled from "styled-components";
import {toInput} from "util/date";

const mapStateToProps = (state: AppState) => {
    return {habits: state.habits.habits, values: state.habits.values};
};
const mapDispatchToProps = dispatch => bindActionCreators({setHabitValue}, dispatch);
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const CheckIns: React.FC<Props> = props => {
    const [date, setDate] = useState(new Date());
    const updateValue = (key) => (value) => {
        props.setHabitValue({key, value, date: toInput(date)})
    };

    const adjacentDate = (mod: number) => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + mod);
        setDate(newDate);
    };
    const prevDate = () => adjacentDate(-1);
    const nextDate = () => adjacentDate(1);
    const setDateFromString = (e) => setDate(new Date(e.target.value));
    const getValue = (habitId) => {
        const dateData = props.values[toInput(date)];
        return dateData && dateData[habitId] && dateData[habitId].value;
    };
    return <div>
        <DateRow>
            <IconButton onClick={prevDate}><IoMdArrowDropleft/></IconButton>
            <Input type="date" label="date" noMargin={true} value={toInput(date)} onChange={setDateFromString}/>
            <IconButton onClick={nextDate}><IoMdArrowDropright/></IconButton>
        </DateRow>
        {Object.keys(props.habits).map(key =>
            <CheckinRow key={key}>
                <CheckIn value={getValue(key)}
                         habit={props.habits[key]}
                         onChange={updateValue(key)}/>
            </CheckinRow>
        )}
    </div>;
};

const DateRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;
const CheckinRow = styled.div`
  border-bottom: 2px solid var(--color-neutral-tint1);
`;

export default connect(mapStateToProps, mapDispatchToProps)(CheckIns);
