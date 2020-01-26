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
    const [initialRender, setInitialRender] = useState(true);

    useEffect(() => {
        if (initialRender) {
            setInitialRender(false);
            return;
        }
        let err;
        if (newPW.length < 5) {
            err = "Password too short";
            setNewPWError(err);
        } else {
            setNewPWError(null);
        }
        if (newPW != repPW) {
            err = "Duplicate doesn't match";
            setRepPWError(err);
        } else {
            setRepPWError(null)
        }
        props.onUpdate(newPW, !err, oldPW);
    }, [newPW, repPW, oldPW]);

    return <div>
        {props.requiresOldPW && <Input type="password" label="Current password" {...bindOldPW}/>}
        <Input type="password" error={newPWError} label="Password" {...bindNewPW}/>
        <Input type="password" error={repPWError} label="Password (repeated)" {...bindRepPW}/>
    </div>;
};

export default PasswordConfirm;
