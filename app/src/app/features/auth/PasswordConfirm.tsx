import Input from "app/common/input/Input";
import React, {useEffect} from "react";
import {isValid, useInput} from "util/inputHook";

type Props = { requiresOldPW?: boolean, onUpdate: (newPW: string, valid: boolean, oldPW: string) => void }

const PasswordConfirm: React.FC<Props> = props => {
    const {onUpdate} = props;
    const newPW = useInput("", s => s.length < 5 ? "Password too short" : undefined);
    const repPW = useInput("", s => newPW.value !== s ? "Duplicate doesn't match" : undefined);
    const {value: oldPW, bind: bindOldPW} = useInput("");
    const pws = [newPW, repPW];

    useEffect(() => {
        console.log("foo");
        onUpdate(newPW.value, !isValid(pws), oldPW);
    }, [onUpdate, newPW, oldPW]);

    return <div>
        {props.requiresOldPW && <Input type="password" label="Current password" {...bindOldPW}/>}
        <Input type="password" label="Password" {...newPW.bind}/>
        <Input type="password" label="Password (repeated)" {...repPW.bind}/>
    </div>;
};

export default PasswordConfirm;
