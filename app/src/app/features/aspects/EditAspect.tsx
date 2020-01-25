import Button from "app/common/buttons/Button";
import ButtonGroup from "app/common/buttons/ButtonGroup";
import Form from "app/common/input/Form";
import Input from "app/common/input/Input";
import {CreateAspect} from "generated/models";
import React, {useState} from "react";
import {MdBrightness1} from "react-icons/all";
import styled, {css} from "styled-components";
import {useInput} from "util/inputHook";
import {clone} from "util/object";

const colors = ['red', 'blue', 'pink', 'yellow', 'green', 'purple', 'black'];

type Props = { aspect: CreateAspect, onSave: (aspect: CreateAspect) => void, onCancel: () => void }
const EditAspect: React.FC<Props> = props => {
    const {value: name, bind: bindName} = useInput(props.aspect.name);
    const {value: weight, bind: bindWeight} = useInput(props.aspect.weight);
    const {value: completed, bind: bindCompleted} = useInput(props.aspect.completed / 10);

    const [selectedColor, selectColor] = useState(props.aspect.color);

    const save = () => {
        const changed = clone(props.aspect);
        changed.name = name;
        changed.weight = weight;
        changed.color = selectedColor;
        changed.completed = completed * 10;
        props.onSave(changed);
    };
    return <Form onSubmit={save}>
        <Input label="Aspect" type="text" {...bindName}/>
        <div className="grid">
            <Input label="Importance (1-10)" type="number" min={1} max={10} {...bindWeight}/>
            <Input label="Current satisfaction (1-10)" type="number" min={1} max={10} {...bindCompleted}/>
        </div>
        <ColorPicker>
            {colors.map(color =>
                <ColorBox selected={selectedColor === color}
                          style={{color: color}}
                          key={color}
                          onClick={() => selectColor(color)}>
                    <MdBrightness1/>
                </ColorBox>)}
        </ColorPicker>
        <ButtonGroup align="right">
            <Button design="secondary" onClick={props.onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
        </ButtonGroup>
    </Form>
        ;
};

export default EditAspect;

const ColorPicker = styled.div`
    font-size: var(--rhythm);
    display: flex;
    justify-content: space-between;
    margin: 24px 8px;
`;
const ColorBox = styled.div<{ selected?: boolean; }>`
    border-radius: 50%;
    display: flex;
    align-items: center;
${p => p.selected && css`
     box-shadow: 0 0 10px 0 var(--color-neutral-shade2);
`}
`;
