import Button from "app/common/buttons/Button";
import ButtonGroup from "app/common/buttons/ButtonGroup";
import Form from "app/common/input/Form";
import Input from "app/common/input/Input";
import {Aspect} from "app/features/aspects/models";
import React from "react";
import {useInput} from "util/inputHook";
import {clone} from "util/object";

type Props = { aspect: Aspect, onSave: (aspect: Aspect) => void, onCancel: () => void }
const EditAspect: React.FC<Props> = props => {
    const {value: name, bind: bindName} = useInput(props.aspect.name);
    const {value: weight, bind: bindWeight} = useInput(props.aspect.weight);
    const save = () => {
        console.log("save");
        const changed = clone(props.aspect);
        changed.name = name;
        changed.weight = weight;
        props.onSave(changed);
    };
    return <div>
        <Form onSubmit={save} >
            <Input label="Aspect" type="text" {...bindName}/>
            <Input label="Weight" type="number" max={10} {...bindWeight}/>
            <ButtonGroup align="right">
                <Button size="small" design="secondary" onClick={() => {
                    console.log("cancel");
                    props.onCancel();
                }}>Cancel</Button>
                <Button size="small" type="submit">Save</Button>
            </ButtonGroup>
        </Form>
    </div>;
};

export default EditAspect;
