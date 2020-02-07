import Button from "app/common/buttons/Button";
import ButtonGroup from "app/common/buttons/ButtonGroup";
import Dropdown from "app/common/input/Dropdown";
import Form from "app/common/input/Form";
import Input from "app/common/input/Input";
import CheckInOptions from "app/features/habit/CheckInOptions";
import {OptionsMap} from "app/features/habit/OptionsModel";
import {Habit} from "generated/models";
import React from "react";
import {device} from "style/styleConstants";
import styled from "styled-components";
import {useInput} from "util/inputHook";

type Props = { onSave: (habit: Habit) => void, onCancel: () => void, habit?: Habit }
const EditHabit: React.FC<Props> = props => {
    const {onSave, habit} = props;
    const {value: title, bind: bindTitle} = useInput(habit ? habit.title : "");
    const {value: option, bind: bindOption} = useInput(habit ? habit.options : 1);


    const submit = () => {
        const newHabit = {...habit};
        newHabit.title = title;
        newHabit.options = option;
        onSave(newHabit);
    };
    return <Form onSubmit={submit}>
        <Input label="Title" {...bindTitle}/>
        <OptionSelect>
            <DropdownWrapper>
                <Dropdown label="Type" {...bindOption}>
                    {Object.keys(OptionsMap).map(o => <option key={o} value={o}>{OptionsMap[o].description}</option>)}
                </Dropdown>
            </DropdownWrapper>
            <Preview>
                <CheckInOptions options={option}/>
            </Preview>
        </OptionSelect>
        <ButtonGroup align="right">
            <Button design="secondary" onClick={props.onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
        </ButtonGroup>
    </Form>;
};

export default EditHabit;

const OptionSelect = styled.div`
@media ${device.screenSm}{
  display: flex;
  align-items: center;
}
`;

const DropdownWrapper = styled.div`
  flex-grow: 1;
  @media ${device.screenSm}{
    margin-right: 8px;
  }
`;

const Preview = styled.div`
  margin-bottom: var(--rhythm);
`;
