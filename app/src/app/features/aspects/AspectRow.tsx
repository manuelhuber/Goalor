import IconButton from "app/common/buttons/IconButton";
import {Aspect} from "generated/models";
import React from "react";
import {MdBrightness1, MdDelete, MdEdit} from "react-icons/all";
import styled, {css} from "styled-components";

export function AspectRow(props: { aspect: Aspect, setEdit: () => void, onDelete: () => void }) {
    const {aspect, setEdit, onDelete} = props;
    return <Row>
        <FlexCenter>
            <FlexCenter style={{color: aspect.color}}><MdBrightness1/></FlexCenter>
            {aspect.name}
        </FlexCenter>
        <FlexCenter>
            <IconButton onClick={setEdit}><MdEdit/></IconButton>
            <IconButton onClick={onDelete}><MdDelete/></IconButton>
        </FlexCenter>
    </Row>
}

export const Row = styled.div<{ iconRow?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 8px;
  padding: 6px 0;
${p => p.iconRow && css`
  align-items: flex-end;
  justify-content: flex-end;
`}
`;
const FlexCenter = styled.div`
    display: flex;
    align-items: center;
`;
