import Button from "app/common/Button";
import {AppState} from "app/Store";
import React, {useState} from "react";
import {connect} from "react-redux"
import {useInput} from "util/inputHook";
import {login, register} from "./duck";
import {bindActionCreators} from "redux";

const mapStateToProps = (state: AppState) => {
    return {isLoading: state.auth.isLoading}
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    login,
    register,
}, dispatch);

const WithLabel = (props: { label: string, children: React.ReactNode }) =>
    <label className='field'>{props.children}<span className='label'>{props.label}</span></label>;

const Authenticate: React.FC<Props> = props => {
    const [isRegistration, setRegistration] = useState(false);

    const {value: username, bind: bindUsername} = useInput("");
    const {value: password, bind: bindPassword} = useInput("");
    const {value: email, bind: bindEmail} = useInput("");

    const submit = (event) => {
        isRegistration ? props.register({username, password, email}) : props.login({username, password});
        event.preventDefault();
    };
    return <div className='wrapper' style={{maxWidth: "25rem"}}>
        <form action="" onSubmit={submit}>
            {isRegistration && <WithLabel label='E-Mail'><input type="email" {...bindEmail}/></WithLabel>}
            <WithLabel label='Username'><input type="text" {...bindUsername}/></WithLabel>
            <WithLabel label='Password'><input type="password" {...bindPassword}/></WithLabel>
            <Button type="submit" block={true}
                    disabled={props.isLoading}>{isRegistration ? "Register" : "Login"}</Button>
        </form>
        <Button onClick={() => setRegistration(!isRegistration)} design='link' block={true}>
            {isRegistration ? "Already registered? Login!" : "New here? Sign up!"}</Button>
    </div>;
};

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);
