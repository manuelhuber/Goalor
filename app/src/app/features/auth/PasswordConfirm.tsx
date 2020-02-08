import Input from "app/common/input/Input";
import React, {useEffect, useState} from "react";
import {useInput} from "util/inputHook";

type Props = { requiresOldPW?: boolean, onUpdate: (newPW: string, valid: boolean, oldPW: string) => void }

const PasswordConfirm: React.FC<Props> = props => {
    const {value: newPW, bind: bindNewPW} = useInput("");
    const {value: repPW, bind: bindRepPW} = useInput("");
    const {value: oldPW, bind: bindOldPW} = useInput("");
    const [newPWError, setNewPWError] = useState(null);
    const [repPWError, setRepPWError] = useState(null);

    useEffect(() => {
        if (!newPW) {
            setNewPWError(null);
            setRepPWError(null);
        } else {
            setNewPWError(newPW.length < 5 ? "Password too short" : null);
            setRepPWError(newPW !== repPW ? "Duplicate doesn't match" : null);
        }

    }, [newPW, repPW, oldPW, setRepPWError, setNewPWError]);

    useEffect(() => {
        props.onUpdate(newPW, !(newPWError || repPWError), oldPW);
    }, [props, newPW, newPWError, repPWError, oldPW]);

    return <div>
        {props.requiresOldPW && <Input type="password" label="Current password" {...bindOldPW}/>}
        <Input type="password" error={newPWError} label="Password" {...bindNewPW}/>
        <Input type="password" error={repPWError} label="Password (repeated)" {...bindRepPW}/>
    </div>;
};

export default PasswordConfirm;
