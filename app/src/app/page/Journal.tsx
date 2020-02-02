import IconButton from "app/common/buttons/IconButton";
import Expandable from "app/common/Expandable";
import SectionTitle from "app/common/SectionTitle";
import {NuxBigText} from "app/common/StyledComponents";
import arrow from "app/features/aspects/right-drawn-arrow.svg"
import {createGratitude} from "app/features/gratitude/duck";
import EditGratitude from "app/features/gratitude/EditGratitude";
import GratitudeList from "app/features/gratitude/GratitudeList";
import {notify} from "app/features/notifications/duck";
import {AppState} from "app/Store";
import React, {useState} from "react";
import {MdAdd} from "react-icons/all";
import {connect} from 'react-redux'
import commonStyle from "style/Common.module.scss";
import {redDark} from "style/styleConstants";
import styled from "styled-components";
import {bindActions} from "util/duckUtil";
import {jc} from "util/style";

const mapStateToProps = (state: AppState) => {
    return {gratitudes: state.gratitude.gratitudeSortedByDate}
};

const mapDispatchToProps = bindActions({notify, createGratitude});

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Journal: React.FC<Props> = props => {
    const [showAdd, setShowAdd] = useState(false);

    const onAdd = (title: string, date: string, description: string, file: File) => {
        setShowAdd(false);
        props.createGratitude(title, date, description, file);
    };

    return <div>
        <div className={commonStyle.padding}><SectionTitle title="Gratitude journal" color={redDark}/></div>
        <Expandable expanded={!showAdd}>
            <NuxBigText>
                Add something that you're grateful for today, like having a good conversation or seeing a cute dog
            </NuxBigText>
            <AddRow className={jc(commonStyle.padding, commonStyle.rightAlign)}>
                <Arrow src={arrow} alt="arrow"/>
                <IconButton onClick={() => setShowAdd(true)}><MdAdd/></IconButton>
            </AddRow>
        </Expandable>
        <Expandable expanded={showAdd}>
            <EditGratitude onSubmit={onAdd} onCancel={() => setShowAdd(false)}/>
        </Expandable>

        <GratitudeList ids={props.gratitudes}/>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Journal);
const Arrow = styled.img`
    max-width: 125px;
    margin-bottom: 20px;
`;
const AddRow = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
`;
