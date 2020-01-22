import React, {useState} from "react";
import {connect} from 'react-redux'
import {AppState} from "app/Store";
import {notify} from "app/features/notifications/duck";
import {bindActions} from "util/duckUtil";
import EditGratitude from "app/features/gratitude/EditGratitude";
import commonStyle from "style/Common.module.scss";
import SectionTitle from "app/common/SectionTitle";
import {redDark} from "style/styleConstants";
import {createGratitude} from "app/features/gratitude/duck";
import GratitudeList from "app/features/gratitude/GratitudeList";
import IconButton from "app/common/buttons/IconButton";
import {MdAdd} from "react-icons/all";
import {css} from "util/style";

const mapStateToProps = (state: AppState) => {
    return {gratitudes: state.gratitude.gratitudeSortedByDate}
};

const mapDispatchToProps = bindActions({notify, createGratitude});

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Journal: React.FC<Props> = props => {
    const [showAdd, setShowAdd] = useState(false);
    return <div>
        <div className={commonStyle.padding}><SectionTitle title="Journal" color={redDark}/></div>
        {!showAdd &&
        <div className={css(commonStyle.padding, commonStyle.rightAlign)}>
            <IconButton onClick={() => setShowAdd(true)}><MdAdd/></IconButton>
        </div>
        }
        {showAdd && <EditGratitude onSubmit={props.createGratitude} onCancel={() => setShowAdd(false)}/>}

        <GratitudeList ids={props.gratitudes}/>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Journal);
