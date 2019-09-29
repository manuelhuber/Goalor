import {AppState} from "app/store";
import React, {useState} from "react";
import {connect} from "react-redux"
import {useInput} from "../../../util/InputHook";
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
        <form action="" onSubmit={submit}>
            <label>Username<input type="text" {...bindUsername}/></label>
            <label>password<input type="password" {...bindPassword}/></label>
            {isRegistration && <label>email<input type="email" {...bindEmail}/></label>}
            <input type="submit" value="Submit"/>
        </form>
        <a onClick={() => setRegistration(!isRegistration)}>{isRegistration ? "Already registered? Login!" : "New here? Sign up!"}</a>
    </div>;
};

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);
