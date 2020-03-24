import Button from "app/common/buttons/Button";
import Form from "app/common/input/Form";
import Input from "app/common/input/Input";
import PasswordConfirm from "app/features/auth/PasswordConfirm";
import {notify} from "app/features/notifications/duck";
import {AppState} from "app/Store";
import React, {useState} from "react";
import {connect} from "react-redux"
import {bindActionCreators} from "redux";
import {isValid, notEmpty, useInput} from "util/inputHook";
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
    const username = useInput("", notEmpty);
    const password = useInput("", notEmpty);
    const email = useInput("", notEmpty);
    const firstName = useInput("");
    const lastName = useInput("");
    const loginForm = [username, password];
    const registrationForm = [username, password, email, firstName, lastName];

    function register() {
        if (!(isValid(registrationForm) && password.value)) {
            props.notify({message: "Missing data"});
            return
        }
        props.register({
            username: username.value,
            password: password.value,
            email: email.value,
            firstName: firstName.value,
            lastName: lastName.value
        });
    }

    function login() {
        if (!isValid(loginForm)) {
            props.notify({message: "Please fill out the form"})
        } else {
            props.login(username.value, password.value);
        }
    }

    const submit = () => isRegistration ? register() : login();
    const reset = () => {
        if (isValid([username])) {
            props.resetPassword(username.value);
        } else {
            props.notify({message: "Please enter your username"})
        }
    };
    return <div className='wrapper'>
        <Form onSubmit={submit}>
            <Input label='Username' {...username.bind}/>
            {!isRegistration &&
            <Input label='Password' type="password" {...password.bind}/>}
            {isRegistration && <>
                <PasswordConfirm onUpdate={(newPW, valid) => password.setValue(valid ? newPW : null)}/>
                <Input label='E-Mail' type="email" {...email.bind}/>
                <Input label='First name' {...firstName.bind}/>
                <Input label='Last name' {...lastName.bind}/>
            </>}
            <Button type="submit" block={true} disabled={props.isLoading}>
                {isRegistration ? "Register" : "Login"}
            </Button>
        </Form>
        <Button onClick={() => setRegistration(!isRegistration)} design='link' block={true}>
            {isRegistration ? "Already registered? Login!" : "New here? Sign up!"}</Button>
        <Button design="link" block={true} onClick={reset}>Reset password</Button>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);
