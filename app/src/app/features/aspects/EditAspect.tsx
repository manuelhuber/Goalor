import Button from "app/common/buttons/Button";
import ButtonGroup from "app/common/buttons/ButtonGroup";
import Form from "app/common/input/Form";
import Input from "app/common/input/Input";
import React, {useState} from "react";
import {useInput} from "util/inputHook";
import {clone} from "util/object";
import {CreateAspect} from "generated/models";
import style from "./Aspects.module.scss";
import {MdBrightness1} from "react-icons/all";
import {css} from "util/style";

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
        <Input label="Importance (1-10)" type="number" min={1} max={10} {...bindWeight}/>
        <Input label="Current fulfillness (1-10)" type="number" min={1} max={10} {...bindCompleted}/>
        <div className={style.colorPicker}>
            {colors.map(color =>
                <div style={{color: color}}
                     key={color}
                     className={css(style.colorBox, [style.selected, selectedColor === color])}
                     onClick={() => selectColor(color)}>
                    <MdBrightness1/>
                </div>)}
        </div>
        <ButtonGroup align="right">
            <Button design="secondary" onClick={props.onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
        </ButtonGroup>
    </Form>
        ;
};

export default EditAspect;
