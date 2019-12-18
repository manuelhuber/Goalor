import Button from "app/common/buttons/Button";
import IconButton from "app/common/buttons/IconButton";
import PieChart from "app/common/PieChart";
import EditAspect from "app/features/aspects/EditAspect";
import {AppState} from "app/Store";
import React, {useEffect, useState} from "react";
import {MdEdit} from "react-icons/all";
import {connect} from "react-redux"
import {bindActionCreators} from "redux";
import style from "./Aspects.module.scss";
import {addAspect, removeAspect, updateAspect} from "./duck";
import {Aspect} from "./models";

const mapStateToProps = (state: AppState) => {
    return {aspects: state.aspects.aspects}
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    addAspect,
    removeAspect,
    updateAspect
}, dispatch);

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Aspects: React.FC<Props> = props => {
    const total = props.aspects.map(a => a.weight).reduce((sum, weight) => sum + weight, 0);
    const createChartEntries = () => props.aspects.map((aspect) => ({
        percentage: aspect.weight / total,
        radius: aspect.completed || 0,
        color: aspect.color || "red",
        onClick: () => console.log(aspect.name)
    }));

    const [edit, setEdit] = useState(-1);
    const [add, setAdd] = useState(false);
    const [circleEntries, setCircleEntries] = useState(createChartEntries());

    useEffect(() => {
        // Recalculate entries only when aspects change
        setCircleEntries(createChartEntries());
    }, [props.aspects]);

    return <div>
        <div>All aspects:</div>
        <div className={style.chartWrapper}><PieChart size={300} entries={circleEntries}/></div>
        <div>
            {props.aspects.map((aspect, index) =>
                <AspectWrapper key={aspect.id}
                               aspect={aspect}
                               editMode={index === edit}
                               setEdit={() => setEdit(index)}
                               onSave={aspect => {
                                   props.updateAspect(aspect);
                                   setEdit(-1)
                               }}
                               cancelEdit={() => setEdit(-1)}/>)}</div>
        <Button size="small" onClick={() => setAdd(!add)}>Add aspect</Button>
        {add && <EditAspect aspect={new Aspect("", 1)}
                            onSave={aspect => props.addAspect(aspect)}
                            onCancel={() => setAdd(false)}
        />}
    </div>;
};

const AspectWrapper = (props: { aspect: Aspect, editMode: boolean, setEdit: () => void, cancelEdit: () => void, onSave: (a: Aspect) => void }) => {
    const {aspect, editMode, setEdit, cancelEdit, onSave} = props;
    if (editMode) {
        return <EditAspect aspect={aspect} onSave={onSave} onCancel={cancelEdit}/>
    } else {
        return <div key={aspect.id || "tmp"}>
            {aspect.name} ({aspect.weight}) <IconButton onClick={setEdit}> <MdEdit/></IconButton>
        </div>
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Aspects);
