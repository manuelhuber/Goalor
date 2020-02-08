import Button from "app/common/buttons/Button";
import Form from "app/common/input/Form";
import PasswordConfirm from "app/features/auth/PasswordConfirm";
import {notify} from "app/features/notifications/duck";
import {AppState} from "app/Store";
import React, {useState} from "react";
import {connect} from "react-redux"
import {bindActionCreators} from "redux";
import {useInput} from "util/inputHook";
import {login, register, resetPassword} from "./duck";

const mapStateToProps = (state: AppState) => {
    return {isLoading: state.auth.isLoading}
};
const mapDispatchToProps = (dispatch) => bindActionCreators({
    login,
    register,
    resetPassword,
    notify
}, dispatch);
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Authenticate: React.FC<Props> = props => {
    const [isRegistration, setRegistration] = useState(false);

    const {value: username, bind: bindUsername} = useInput("");
    const {value: password, setValue: setPassword, bind: bindPassword} = useInput("");
    const {value: email, bind: bindEmail} = useInput("");
    const {value: firstName, bind: bindFirstName} = useInput("");
    const {value: lastName, bind: bindLastName} = useInput("");

    const submit = () => {
        isRegistration ?
            props.register({username, password, email, firstName, lastName}) :
            props.login(username, password);
    };
    const reset = () => {
        if (username) {
            props.resetPassword(username);
        } else {
            props.notify({message: "Please enter your username"})
        }
    };
    return <div className='wrapper'>
        <Form onSubmit={submit}>
            <WithLabel label='Username'><input type="text" {...bindUsername}/></WithLabel>
            {!isRegistration &&
            <WithLabel label='Password'><input type="password" {...bindPassword}/></WithLabel>}
            {isRegistration && <>
                <PasswordConfirm onUpdate={(newPW, valid, oldPW) =>
                    setPassword(valid ? newPW : null)
                }/>
                <WithLabel label='E-Mail'><input type="email" {...bindEmail}/></WithLabel>
                <WithLabel label='First name'><input type="text" {...bindFirstName}/></WithLabel>
                <WithLabel label='Last name'><input type="text" {...bindLastName}/></WithLabel>
            </>}
            <Button type="submit" block={true}
                    disabled={!password || props.isLoading}>{isRegistration ? "Register" : "Login"}</Button>
        </Form>
        <Button onClick={() => setRegistration(!isRegistration)} design='link' block={true}>
            {isRegistration ? "Already registered? Login!" : "New here? Sign up!"}</Button>
        <Button design="link" block={true} onClick={reset}>Forgot password?</Button>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);

const WithLabel = (props: { label: string, children: React.ReactNode }) =>
    <label className='field'>{props.children}<span className='label'>{props.label}</span></label>;
