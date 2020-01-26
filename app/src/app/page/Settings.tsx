import AccountSettings from "app/features/account/AccountSettings";
import ProfileHeader from "app/features/account/ProfileHeader";
import {AppState} from "app/Store";
import React from "react";
import {connect} from 'react-redux'
import styled from "styled-components";

const mapStateToProps = (state: AppState) => {
    return {}
};

const mapDispatchToProps = {};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const Settings: React.FC<Props> = props => {
    const background = "https://www.itl.cat/pngfile/big/0-7755_nature-pier-bridge-d-river-water-sunset-night.jpg";
    const profile = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";
    return <div>
        <ProfileHeader background={background} profile={profile}/>
        <Content>
            <AccountSettings/>
        </Content>
    </div>;
};

const Content = styled.div`
padding: 8px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
