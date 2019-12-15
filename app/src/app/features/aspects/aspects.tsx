import React from "react";
import {connect} from 'react-redux'
import {AppState} from "app/Store";
import {addAspectRequest, removeAspect} from './duck';
import {useInput} from '../../../util/InputHook';
import Button from '../../common/Button';
import {Aspect} from './models';
import {bindActionCreators} from 'redux';
import PieChart, {CircleEntry} from '../../common/pieChart';

const mapStateToProps = (state: AppState) => {
    return {aspects: state.aspects.aspects}
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    addAspectRequest,
    removeAspect
}, dispatch);

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Aspects: React.FC<Props> = props => {

    const total = props.aspects.map(a => a.weight).reduce((sum, weight) => sum + weight, 0);
    const circleEntries: CircleEntry[] = props.aspects.map((aspect, index) => ({
        percentage: aspect.weight / total,
        radius: aspect.completed || 0,
        color: aspect.color || "red"
    }));

    const {value: newAspect, bind: bindNewAspect} = useInput('');
    const {value: newWeight, bind: bindWeight} = useInput(1);
    return <div>
        <div>
            All aspects:
        </div>
        <div>
            {props.aspects.map(aspect => <div key={aspect.id || "tmp"}>
                {aspect.name} ({aspect.weight})
            </div>)}
        </div>
        <PieChart size={300} entries={circleEntries}/>
        <input type="text" {...bindNewAspect} />
        <input type="number" {...bindWeight} />
        <Button onClick={() => props.addAspectRequest({aspect: new Aspect(newAspect, Number(newWeight))})}>Add
            aspect</Button>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Aspects);
