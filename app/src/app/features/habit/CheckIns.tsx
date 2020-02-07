import IconButton from "app/common/buttons/IconButton";
import Input from "app/common/input/Input";
import PopupMenu from "app/common/PopupMenu";
import CheckIn from "app/features/habit/CheckIn";
import {deleteHabit, updateHabit, updateHabitValue} from "app/features/habit/duck";
import EditHabit from "app/features/habit/EditHabit";
import {AppState} from "app/Store";
import {Habit} from "generated/models";
import React, {useState} from "react";
import {IoMdArrowDropleft, IoMdArrowDropright, MdDelete, MdEdit} from "react-icons/all";
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import styled from "styled-components";
import {serialise} from "util/date";

const mapStateToProps = (state: AppState) => {
    return {habits: state.habits.habits, values: state.habits.values};
};
const mapDispatchToProps = dispatch => bindActionCreators({updateHabitValue, deleteHabit, updateHabit}, dispatch);
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const CheckIns: React.FC<Props> = props => {
    const [date, setDate] = useState(new Date());
    const [edit, setEdit] = useState("");
    const updateValue = (habitId) => (value) => props.updateHabitValue(date, value, habitId);
    const adjacentDate = (mod: number) => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + mod);
        setDate(newDate);
    };
    const prevDate = () => adjacentDate(-1);
    const nextDate = () => adjacentDate(1);
    const setDateFromString = (e) => {
        let newDate = new Date(e.target.value);
        // Prevent the "clear" function of date input
        if (!isNaN(newDate.getDate())) {
            setDate(newDate);
        }
    };
    const getValue = (habitId) => {
        const dateData = props.values[serialise(date)];
        return dateData && dateData[habitId] && dateData[habitId];
    };
    const updateHabit = (habit: Habit) => {
        props.updateHabit(habit);
        setEdit("");
    };
    return <div>
        <DateRow>
            <IconButton onClick={prevDate}><IoMdArrowDropleft/></IconButton>
            <Input type="date" label="date" noMargin={true} value={serialise(date)} onChange={setDateFromString}/>
            <IconButton onClick={nextDate}><IoMdArrowDropright/></IconButton>
        </DateRow>
        {Object.entries(props.habits).map(([habitId, habit]) =>
            habitId !== edit
                ? <CheckinRow key={habitId}>
                    <CheckinIcons>
                        <CheckIn value={getValue(habitId)}
                                 habit={habit}
                                 onChange={updateValue(habitId)}/>
                    </CheckinIcons>
                    <PopupMenu entries={[
                        {icon: MdDelete, text: "Delete", onClick: () => props.deleteHabit(habitId)},
                        {icon: MdEdit, text: "Edit", onClick: () => setEdit(habitId)}
                    ]}/>
                </CheckinRow>
                : <EditHabit key={habitId} onCancel={() => setEdit("")} habit={habit} onSave={updateHabit}/>
        )}
    </div>;
};

const DateRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;
const CheckinRow = styled.div`
  display: flex;
  align-items: baseline;
  border-bottom: 2px solid var(--color-neutral-tint1);
`;
const CheckinIcons = styled.div`
  flex-grow: 1;
`;

export default connect(mapStateToProps, mapDispatchToProps)(CheckIns);
