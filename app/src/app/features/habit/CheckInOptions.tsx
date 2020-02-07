import IconButton from "app/common/buttons/IconButton";
import {OptionsMap} from "app/features/habit/OptionsModel";
import React from "react";
import styled, {css} from "styled-components";

type Props = { options: number, selected?: number, onClick?: (x: number) => void }
const CheckInOptions: React.FC<Props> = props => {
    const {onClick, selected, options} = props;
    return <CheckinOptions>{OptionsMap[options].entries.map(entry =>
        <CheckinOption key={entry.value} inverted={entry.value === selected}>
            <IconButton onClick={() => onClick && onClick(entry.value)}>
                <entry.icon/>
            </IconButton>
        </CheckinOption>)}
    </CheckinOptions>;
};

export default CheckInOptions;
const CheckinOptions = styled.div`
  display: flex;
`;
const CheckinOption = styled.div<{ inverted: boolean }>`
  --line-height-ratio: 1;
  font-size: var(--font-size);
${p => p.inverted && css`filter:invert(1);`}
`;
