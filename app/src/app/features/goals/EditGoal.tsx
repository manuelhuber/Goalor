import Dropdown from "app/common/input/Dropdown";
import Input from "app/common/input/Input";
import TextArea from "app/common/input/TextArea";
import Modal from "app/common/Modal";
import {Aspect, Goal} from "generated/models";
import React from "react";
import {useInput} from "util/inputHook";

type Props = {
    goal?: Goal,
    onSave: (goal: Goal) => void,
    onAttemptClose: () => void,
    open: boolean,
    title: string,
    aspects: Aspect[],
    potentialParents: Goal[]
}

const EditGoal: React.FC<Props> = props => {
    const {goal, onSave, onAttemptClose, open, title: modalTitle, aspects, potentialParents} = props;
    const {value: title, bind: bindTitle} = useInput(goal?.title || "");
    const {value: description, bind: bindDescription} = useInput(goal?.description || "");
    const {value: aspect, setValue: setAspect, bind: bindAspect} = useInput(goal?.aspect);
    const {value: parent, setValue: setParent} = useInput(goal?.parent);
    const updateParent = event => {
        let parentId = event.target.value;
        setParent(parentId);
        if (!parentId) return;
        let find = potentialParents.find(goal => goal.id === parentId);
        if (!find) return;
        setAspect(find.aspect);
    };

    const save = () => {
        const newGoal = {...goal, title, description, aspect, parent: parent || null};
        onSave(newGoal);
    };

    return <Modal title={modalTitle}
                  open={open}
                  onAttemptClose={onAttemptClose}
                  onConfirm={save}
                  confirmLabel="Save">
        <Input label="Title" {...bindTitle}/>
        <TextArea label="Description" {...bindDescription}/>
        {!!parent && <div>Goals inherit the aspect of their parent goal</div>}
        <Dropdown label="Aspect" disabled={!!parent} nullOption={true} {...bindAspect}>
            {aspects.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </Dropdown>
        <Dropdown label="Parent goal" nullOption={true} value={parent} onChange={updateParent}>
            {potentialParents.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
        </Dropdown>
    </Modal>;
};

export default EditGoal;
