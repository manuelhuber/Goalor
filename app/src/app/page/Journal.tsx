import AddRow from "app/common/AddRow";
import Expandable from "app/common/Expandable";
import SectionTitle from "app/common/SectionTitle";
import {createGratitude} from "app/features/gratitude/duck";
import EditGratitude from "app/features/gratitude/EditGratitude";
import GratitudeList from "app/features/gratitude/GratitudeList";
import {notify} from "app/features/notifications/duck";
import {AppState} from "app/Store";
import React, {useState} from "react";
import {connect} from 'react-redux'
import commonStyle from "style/Common.module.scss";
import {redDark} from "style/styleConstants";
import {bindActions} from "util/duckUtil";

const mapStateToProps = (state: AppState) => {
    return {gratitudes: state.gratitude.gratitudeSortedByDate}
};

const mapDispatchToProps = bindActions({notify, createGratitude});

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Journal: React.FC<Props> = props => {
    const [showAdd, setShowAdd] = useState(false);

    const onAdd = (title: string, date: Date, description: string, file: File) => {
        setShowAdd(false);
        props.createGratitude(title, date, description, file);
    };

    return <div>
        <div className={commonStyle.padding}><SectionTitle title="Gratitude journal" color={redDark}/></div>
        <Expandable expanded={!showAdd}>
            <AddRow nuxText="Add something that you're grateful for today, like having a good conversation or seeing a cute dog"
                    showNux={!props.gratitudes.length} onAdd={() => setShowAdd(true)}/>
        </Expandable>
        <Expandable expanded={showAdd}>
            <EditGratitude onSubmit={onAdd} onCancel={() => setShowAdd(false)}/>
        </Expandable>
        <GratitudeList ids={props.gratitudes}/>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Journal);
