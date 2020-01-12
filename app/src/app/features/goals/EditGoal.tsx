import React from "react";
import {Aspect, Goal} from "generated/models";
import Modal from "app/common/Modal";
import Input from "app/common/input/Input";
import {useInput} from "util/inputHook";
import Dropdown from "app/common/input/Dropdown";

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
    const {value: title, bind: bindTitle} = useInput(goal?.title);
    const {value: description, bind: bindDescription} = useInput(goal?.description);
    const {value: aspect, setValue: setAspect, bind: bindAspect} = useInput(goal?.aspect);
    const {value: parent, setValue: setParent} = useInput(goal?.parent);
    const updateParent = event => {
        let parentId = event.target.value;
        setParent(parentId);
        if (!!parentId) {
            setAspect(potentialParents.find(goal => goal.id === parentId).aspect);
        }
    };

    const save = () => {
        const newGoal = {...goal, title, description, aspect, parent};
        onSave(newGoal);
    };

    return <Modal title={modalTitle}
                  open={open}
                  onAttemptClose={onAttemptClose}
                  onConfirm={save}
                  confirmLabel="Save">
        <Input label="Title" {...bindTitle}/>
        <Input type="textarea" label="Description" {...bindDescription}/>
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
