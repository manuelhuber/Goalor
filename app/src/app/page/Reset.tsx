import Button from "app/common/buttons/Button";
import {updatePassword} from "app/features/auth/duck";
import PasswordConfirm from "app/features/auth/PasswordConfirm";
import {AppState} from "app/Store";
import React, {useState} from "react";
import {connect} from 'react-redux'
import {useHistory, useParams} from "react-router";
import {bindActions} from "util/duckUtil";

const mapStateToProps = (state: AppState) => {
    return {}
};

const mapDispatchToProps = bindActions({updatePassword});

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Reset: React.FC<Props> = props => {
    const {token} = useParams();
    const [password, setPassword] = useState();
    const pwUpdate = (newPW, valid, oldPW) => {
        setPassword(valid ? newPW : null)
    };
    const history = useHistory();
    const savePassword = async () => {
        props.updatePassword(null, password, token).then(x => {
            history.push("/login")
        });
    };
    return <div>
        <PasswordConfirm onUpdate={pwUpdate}/>
        <Button onClick={savePassword}>Set Password</Button>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Reset);
