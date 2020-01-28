import {fancyFont} from "style/styleConstants";
import styled, {css} from "styled-components";

const Header = styled.header<{ noStyle?: boolean; }>`
    padding: 4px 4px 8px 4px;
    min-height: var(--rhythm);
    background: var(--color-primary);
${p => !p.noStyle && css`
    color: var(--color-neutral-tint4);
    font-family: ${fancyFont};
    font-weight: normal;
`}
`;

export default Header;
