import AddRow from "app/common/AddRow";
import Expandable from "app/common/Expandable";
import PieChart from "app/common/PieChart";
import {AspectRow} from "app/features/aspects/AspectRow";
import EditAspect from "app/features/aspects/EditAspect";
import {AppState} from "app/Store";
import {Aspect} from "generated/models";
import React, {useEffect, useState} from "react";
import {connect} from "react-redux"
import styled from "styled-components";
import {bindActions} from "util/duckUtil";
import {createAspect, deleteAspect, updateAspect} from "./duck";

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

    const saveAspect = aspect => {
        props.updateAspect(aspect);
        setEdit(-1);
    };

    const createAspect = aspect => {
        props.createAspect(aspect);
        setAdd(false);
    };
    const deleteAspect = (id) => () => props.deleteAspect(id);
    const editAspect = (id) => () => setEdit(id);

    return <div>
        {!!circleEntries.length && <ChartWrapper>
            <PieChart size={250} entries={circleEntries}/>
        </ChartWrapper>}
        <div>{props.aspects.map((aspect, index) =>
            <AspectEntry key={aspect.id || "tmp"}>
                <Expandable expanded={index !== edit}>
                    <AspectRow aspect={aspect}
                               setEdit={editAspect(index)}
                               onDelete={deleteAspect(aspect.id)}/>
                </Expandable>
                <Expandable expanded={index === edit}>
                    <EditAspect aspect={aspect}
                                onSave={saveAspect}
                                onCancel={editAspect(-1)}/>
                </Expandable>
            </AspectEntry>)}
            <Expandable expanded={!add}>
                <AddRow showNux={!props.aspects.length}
                        onAdd={() => setAdd(!add)}
                        nuxText="Add a life aspect that's important to you, like 'Health' or 'Hobbies'"/>
            </Expandable>

        </div>
        <Expandable expanded={add}>
            <EditAspect aspect={{name: "", weight: 5, color: "red", completed: 50}}
                        onSave={createAspect}
                        onCancel={() => setAdd(false)}/>
        </Expandable>
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

export default connect(mapStateToProps, mapDispatchToProps)(Aspects);

const ChartWrapper = styled.div`
    text-align: center;
`;
const Arrow = styled.img`
    max-width: 125px;
    margin-bottom: 20px;
`;
const AspectEntry = styled.div`
  border-bottom: 2px solid var(--color-neutral-tint1);
  &:last-child {
    border-bottom: none;
  }
`;
