import {updateGratitude} from "app/features/gratitude/duck";
import EditGratitude from "app/features/gratitude/EditGratitude";
import GratitudeCard from "app/features/gratitude/GratitudeCard";
import {AppState} from "app/Store";
import {Gratitude} from "generated/models";
import React, {useState} from "react";
import {connect} from "react-redux";
import commonStyle from "style/Common.module.scss";
import {bindActions} from "util/duckUtil";

const mapStateToProps = (state: AppState, props: { ids: string[] }) => {
    return {entries: props.ids.map(id => state.gratitude.gratitude[id])}
};
const mapDispatchToProps = bindActions({updateGratitude});
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const GratitudeList: React.FC<Props> = props => {
    const [inEdit, setInEdit] = useState(null);

    const submit = (gratitude: Gratitude) => (title: string, date: Date, description: string, file: File) => {
        props.updateGratitude({...gratitude, title, date, description});
        setInEdit(false);
    };

    return <div>
        {props.entries.map(entry =>
            <div key={entry.id} className={commonStyle.padding}>
                {inEdit === entry.id
                    ? <EditGratitude {...entry} onSubmit={submit(entry)} onCancel={() => setInEdit(null)}/>
                    : (<GratitudeCard gratitude={entry} onEdit={() => setInEdit(entry.id)}/>)}
            </div>
        )}
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(GratitudeList);
