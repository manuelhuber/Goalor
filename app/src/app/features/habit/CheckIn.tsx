import CheckInOptions from "app/features/habit/CheckInOptions";
import {Habit} from "generated/models";
import React from "react";
import {device} from "style/styleConstants";
import styled from "styled-components";

type Props = { habit: Habit, value: number, onChange: (v: number) => void }
const CheckIn: React.FC<Props> = props => {
    const {onChange, habit} = props;
    const update = (v) => onChange(v === props.value ? null : v);
    return <Root>
        <Title>{habit.title}</Title>
        <Options>
            <CheckInOptions options={habit.options} selected={props.value} onClick={update}/>
        </Options>
    </Root>;
};

export default CheckIn;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  @media ${device.screenMd}{
    flex-direction: row;
  }
  padding: 8px;
`;
const Title = styled.div`
  align-self: flex-start;
  @media ${device.screenMd}{
    align-self: auto;
  }
`;
const Options = styled.div`
  align-self: flex-end;
  @media ${device.screenMd}{
    align-self: auto;
  }
`;
