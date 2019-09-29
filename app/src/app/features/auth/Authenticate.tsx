import {AppState} from "app/Store";
import React, {useState} from "react";
import {connect} from "react-redux"
import {useInput} from "../../../util/InputHook";
import {jc} from "../../../util/style";
import {login, LoginRequest, register, RegisterRequest} from "./duck";

const mapStateToProps = (state: AppState) => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: async (req: LoginRequest) => await dispatch(login(req)),
        register: async (req: RegisterRequest) => await dispatch(register(req))
    }
};

const Authenticate: React.FC<Props> = props => {
    const [isRegistration, setRegistration] = useState(false);

    const {value: username, bind: bindUsername} = useInput("");
    const {value: password, bind: bindPassword} = useInput("");
    const {value: email, bind: bindEmail} = useInput("");

    const submit = (event) => {
        isRegistration ? props.login({username, password}) : props.register({username, password, email});
        event.preventDefault();
    };
    return <div>
        <form action="" onSubmit={submit} className='wrapper'>
            <label className='field'><input type="text" {...bindUsername}/><span className='label'>Username</span></label>
            <label className='field'><input type="password" {...bindPassword}/><span className='label'>password</span></label>
            {isRegistration &&
            <label className='field'><input type="email" {...bindEmail}/><span className='label'>email</span></label>}
            <input type="submit" value={isRegistration ? "Register" : "Login"} className={jc("button", "-block")}/>
        </form>
        <a onClick={() => setRegistration(!isRegistration)}>{isRegistration ? "Already registered? Login!" : "New here? Sign up!"}</a>
    </div>;
};

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);
