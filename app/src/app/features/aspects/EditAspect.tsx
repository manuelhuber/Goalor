import Button from "app/common/buttons/Button";
import ButtonGroup from "app/common/buttons/ButtonGroup";
import Form from "app/common/input/Form";
import Input from "app/common/input/Input";
import React from "react";
import {useInput} from "util/inputHook";
import {clone} from "util/object";
import {CreateAspect} from "generated/models";

type Props = { aspect: CreateAspect, onSave: (aspect: CreateAspect) => void, onCancel: () => void }
const EditAspect: React.FC<Props> = props => {
    const {value: name, bind: bindName} = useInput(props.aspect.name);
    const {value: weight, bind: bindWeight} = useInput(props.aspect.weight);
    const save = () => {
        const changed = clone(props.aspect);
        changed.name = name;
        changed.weight = weight;
        props.onSave(changed);
    };
    return <Form onSubmit={save}>
        <Input label="Aspect" type="text" {...bindName}/>
        <Input label="Weight" type="number" max={10} {...bindWeight}/>
        {props.aspect.color}
        <ButtonGroup align="right">
            <Button design="secondary" onClick={props.onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
        </ButtonGroup>
    </Form>;
};

export default EditAspect;
