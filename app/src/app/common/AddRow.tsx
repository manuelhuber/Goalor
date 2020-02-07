import IconButton from "app/common/buttons/IconButton";
import {NuxBigText} from "app/common/StyledComponents";
import arrow from "app/features/aspects/right-drawn-arrow.svg";
import React from "react";
import {MdAdd} from "react-icons/all";
import styled from "styled-components";

type Props = { nuxText: string, onAdd: () => void, showNux: boolean }
const AddRow: React.FC<Props> = props => <div>
    {props.showNux && <NuxBigText>{props.nuxText}</NuxBigText>}
    <Row>
        {props.showNux && <Arrow src={arrow} alt="arrow"/>}
        <IconButton onClick={() => props.onAdd()}><MdAdd/></IconButton>
    </Row>
</div>;

export default AddRow;
const Arrow = styled.img`
    max-width: 125px;
    margin-bottom: 20px;
`;
const Row = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding: 8px;
`;
