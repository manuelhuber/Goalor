import React from "react";
import styled from "styled-components";

const ProfileHeader: React.FC<{ background: string, profile: string }> = props =>
    <div>
        <Header>
            <BackgroundImage url={props.background}/>
            <ProfileImage url={props.profile}/>
        </Header>
    </div>;

const ProfileHeight = 150;
const Header = styled.div`
position: relative;
height: 200px;
width: 100%;
margin-bottom: ${ProfileHeight / 2}px;
`;
const BackgroundImage = styled.div<{ url: string }>`
height: 100%;
width: 100%;
background-size: cover;
background-position: center;
background-image: url("${p => p.url}");
`;
const ProfileImage = styled.div<{ url: string }>`
position: absolute;
top: 100%;
left: 50%;
transform: translate(-50%, -50%);
width: ${ProfileHeight}px;
height: ${ProfileHeight}px;
border-radius: 100%;

background-size: cover;
background-position: center;
background-image: url("${p => p.url}");
`;

export default ProfileHeader;
