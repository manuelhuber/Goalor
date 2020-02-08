import Button from "app/common/buttons/Button";
import Form from "app/common/input/Form";
import Input from "app/common/input/Input";
import Modal from "app/common/Modal";
import {updateAccount} from "app/features/account/duck";
import {updatePassword} from "app/features/auth/duck";
import PasswordConfirm from "app/features/auth/PasswordConfirm";
import {AppState} from "app/Store";
import React, {useEffect, useState} from "react";
import {connect} from 'react-redux'
import styled from "styled-components";
import {bindActions} from "util/duckUtil";
import {useInput} from "util/inputHook";

const mapStateToProps = (state: AppState) => {
    return {...state.account}
};

const mapDispatchToProps = bindActions({updateAccount, updatePassword});

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const AccountSettings: React.FC<Props> = props => {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const {value: username, setValue: setUsername, bind: bindUsername} = useInput(props.username);
    const {value: email, setValue: setEmail, bind: bindEmail} = useInput(props.email);
    const {value: first, setValue: setFirst, bind: bindFirst} = useInput(props.firstName);
    const {value: last, setValue: setLast, bind: bindLast} = useInput(props.lastName);

    useEffect(() => {
        setUsername(props.username);
        setEmail(props.email);
        setFirst(props.firstName);
        setLast(props.lastName);
    }, [props, setUsername, setEmail, setFirst, setLast]);

    function pwUpdate(newPW: string, valid: boolean, oldPW: string) {
        setPassword(valid ? newPW : null);
        setOldPassword(oldPW)
    }

    const savePW = () => {
        if (password) {
            props.updatePassword(oldPassword, password);
            setShowPasswordModal(false);
        }
    };

    const submit = () => {
        props.updateAccount({lastName: last, firstName: first, username, email, id: ""})
    };

    return <Form onSubmit={submit}>
        <Input label="username" {...bindUsername}/>
        <Input type="email" label="email" {...bindEmail}/>
        <Input label="first name" {...bindFirst}/>
        <Input label="last name" {...bindLast}/>
        <Button block={true}
                design="outlined"
                onClick={() => setShowPasswordModal(!showPasswordModal)}>
            Change password
        </Button>
        <Modal open={showPasswordModal}
               onAttemptClose={() => setShowPasswordModal(false)}
               title="Change password"
               onConfirm={savePW}
               confirmDisabled={!password}
               confirmLabel="Update">
            <PasswordConfirm onUpdate={pwUpdate} requiresOldPW={true}/>
        </Modal>
        <SaveRow>
            <Button type="submit">Save</Button>
        </SaveRow>
    </Form>;
};

const SaveRow = styled.div`
margin-top: var(--rhythm);
text-align: right;
`;

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);

