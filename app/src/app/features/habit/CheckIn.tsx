import IconButton from "app/common/buttons/IconButton";
import {Habit} from "app/features/habit/duck";
import React from "react";
import {
    FaMinus,
    MdCheck,
    MdSentimentDissatisfied,
    MdSentimentNeutral,
    MdSentimentSatisfied,
    MdSentimentVeryDissatisfied,
    MdSentimentVerySatisfied,
    MdThumbDown,
    MdThumbUp
} from "react-icons/all";
import {device} from "style/styleConstants";
import styled, {css} from "styled-components";

type OptionEntry = { value: number, icon: any }
const OptionsMap: { [key: string]: OptionEntry[] } = {
    "1": [
        {"value": 1, icon: MdCheck}
    ],
    "2": [
        {"value": -1, icon: MdThumbDown},
        {"value": 1, icon: MdThumbUp}
    ],
    "3": [
        {"value": -1, icon: MdThumbDown},
        {"value": 0, icon: FaMinus},
        {"value": 1, icon: MdThumbUp},
    ],
    "4": [
        {"value": -2, icon: MdSentimentVeryDissatisfied},
        {"value": -1, icon: MdSentimentDissatisfied},
        {"value": 1, icon: MdSentimentSatisfied},
        {"value": 2, icon: MdSentimentVerySatisfied},
    ],
    "5": [
        {"value": -2, icon: MdSentimentVeryDissatisfied},
        {"value": -1, icon: MdSentimentDissatisfied},
        {"value": 0, icon: MdSentimentNeutral},
        {"value": 1, icon: MdSentimentSatisfied},
        {"value": 2, icon: MdSentimentVerySatisfied},
    ]
};

type Props = { habit: Habit, value: number, onChange: (v: number) => void }
const CheckIn: React.FC<Props> = props => {
    const {onChange, habit} = props;
    const update = (v) => () => onChange(v === props.value ? null : v);
    return <Root>
        <Title>{props.habit.title}</Title>
        <CheckinOptions>{OptionsMap[props.habit.options].map(entry =>
            <CheckinOption key={entry.value} inverted={entry.value === props.value}>
                <IconButton onClick={update(entry.value)}>
                    <entry.icon/>
                </IconButton>
            </CheckinOption>)}
        </CheckinOptions>
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
const CheckinOptions = styled.div`
  align-self: flex-end;
  @media ${device.screenMd}{
    align-self: auto;
  }
  display: flex;
`;
const CheckinOption = styled.div<{ inverted: boolean }>`
  --line-height-ratio: 1;
  font-size: var(--font-size);
${p => p.inverted && css`filter:invert(1);`}
`;
