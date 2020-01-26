import React from "react";
import {red} from "style/styleConstants";
import styled, {css} from "styled-components";
import {jc} from "util/style";

type Props = { label: React.ReactNode, noMargin?: boolean, error?: string }
const Input: React.FC<Props & React.InputHTMLAttributes<HTMLInputElement>> = props => {
    const {noMargin, ...passOnProps} = props;
    return <>
        <Error>{props.error}</Error>
        <label className={jc("field", ["mb-zero", props.noMargin])}>
            <StyledInput red={!!props.error} {...passOnProps}/>
            <Label red={!!props.error} className="label">{props.label}</Label>
        </label>
    </>;
};

const Error = styled.div`
color: ${red};
margin-bottom: 4px;
`;
const StyledInput = styled.input<{ red: boolean }>`
&&{
${p => p.red && css`border-color: ${red}`}
}
`;
const Label = styled.span<{ red: boolean }>`
${p => p.red && css`color: ${red}`}
`;

export default Input;
