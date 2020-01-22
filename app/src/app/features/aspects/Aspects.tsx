import IconButton from "app/common/buttons/IconButton";
import PieChart from "app/common/PieChart";
import EditAspect from "app/features/aspects/EditAspect";
import {AppState} from "app/Store";
import React, {useEffect, useState} from "react";
import {MdAdd, MdBrightness1, MdDelete, MdEdit} from "react-icons/all";
import {connect} from "react-redux"
import style from "./Aspects.module.scss";
import {createAspect, deleteAspect, updateAspect} from "./duck";
import {Aspect} from "generated/models";
import {bindActions} from "util/duckUtil";
import arrow from "app/features/aspects/right-drawn-arrow.svg"
import {css} from "util/style";

const mapStateToProps = (state: AppState) => {
    return {aspects: Object.values(state.aspects.aspectsById)}
};

const mapDispatchToProps = bindActions({
    createAspect,
    deleteAspect,
    updateAspect,
});
type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Aspects: React.FC<Props> = props => {

    const [edit, setEdit] = useState(-1);
    const [add, setAdd] = useState(false);
    const [circleEntries, setCircleEntries] = useState(createChartEntries(props.aspects));

    useEffect(() => {
        // Recalculate entries only when aspects change
        setCircleEntries(createChartEntries(props.aspects));
    }, [props.aspects]);
    return <div>
        <div className={style.chartWrapper}>
            {circleEntries.length ?
                <PieChart size={250} entries={circleEntries}/> :
                <div className={style.noAspects}>
                    <div>Add a life aspect that's important to you, like "Health" or "Hobbies"</div>
                </div>
            }
        </div>
        <div>{props.aspects.map((aspect, index) =>
            <EditableAspect key={aspect.id}
                            aspect={aspect}
                            editMode={index === edit}
                            setEdit={() => setEdit(index)}
                            onSave={aspect => {
                                props.updateAspect(aspect);
                                setEdit(-1);
                            }}
                            cancelEdit={() => setEdit(-1)}
                            onDelete={() => props.deleteAspect(aspect.id)}/>)}
            {!add &&
            <div className={css(style.aspectLine, style.addIconRow)}>
                {!circleEntries.length && <img className={style.arrow} src={arrow} alt="arrow"/>}
                <IconButton onClick={() => setAdd(!add)}><MdAdd/></IconButton>
            </div>
            }
        </div>
        {add && <EditAspect aspect={{name: "", weight: 5, color: "red", completed: 50}}
                            onSave={aspect => {
                                props.createAspect(aspect);
                                setAdd(false);
                            }}
                            onCancel={() => setAdd(false)}/>}
    </div>;
};

const createChartEntries = (aspects: Aspect[]) => {
    const total = aspects.map(a => a.weight).reduce((sum, weight) => sum + weight, 0);
    return aspects.map((aspect) => ({
        percentage: aspect.weight / total,
        radius: (aspect.completed / 100) || 0,
        color: aspect.color || "red",
        onClick: () => console.log(aspect.name),
    }));
};

const EditableAspect = (props: {
    aspect: Aspect,
    editMode: boolean,
    setEdit: () => void,
    cancelEdit: () => void,
    onSave: (a: Aspect) => void,
    onDelete: () => void
}) => {
    const {aspect, editMode, setEdit, cancelEdit, onSave, onDelete} = props;
    if (editMode) {
        return <EditAspect aspect={aspect} onSave={onSave} onCancel={cancelEdit}/>
    } else {
        return <div key={aspect.id || "tmp"} className={style.aspectLine}>
            <div className={style.flexCenter}>
                <div className={style.flexCenter} style={{color: aspect.color}}><MdBrightness1/></div>
                {aspect.name}
            </div>
            <div className={style.flexCenter}>
                <IconButton onClick={setEdit}><MdEdit/></IconButton>
                <IconButton onClick={onDelete}><MdDelete/></IconButton>
            </div>
        </div>
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Aspects);
