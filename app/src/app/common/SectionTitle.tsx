import React from "react";
import {fancyFont} from "style/styleConstants";
import styled from "styled-components";

const SectionTitle: React.FC<{ title: string, color: string }> = props => {
    return <Title style={{color: props.color}}>
        <TitleText className={"m-zero"}>{props.title}</TitleText>
        <TitleLine color={props.color}/>
    </Title>;
};

export default SectionTitle;
const Title = styled.div`
    display: flex;
    align-items: baseline;
`;
const TitleText = styled.h4`
    font-family: ${fancyFont};
`;
const TitleLine = styled.hr<{ color: string; }>`
    flex-grow: 1;
    height: 3px;
    border: none;
    margin-left: -5px;
    margin-bottom: 0;
    background: linear-gradient(to right, ${p => p.color}, rgba(0, 0, 0, 0));
    // Override cutestrap
    &:before{content: none;}
`;
