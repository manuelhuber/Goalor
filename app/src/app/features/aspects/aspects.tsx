import React from "react";
import {connect} from 'react-redux'
import {AppState} from "app/Store";
import {addAspectRequest, removeAspect} from './duck';
import {useInput} from '../../../util/InputHook';
import Button from '../../common/Button';
import {Aspect} from './models';
import {bindActionCreators} from 'redux';

const mapStateToProps = (state: AppState) => {
    return {aspects: state.aspects.aspects}
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    addAspectRequest,
    removeAspect
}, dispatch);

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Aspects: React.FC<Props> = props => {
    const {value: newAspect, bind: bindNewAspect} = useInput('');
    return <div>
        <div>
            All aspects:
        </div>
        <div>
            {props.aspects.map(aspect => <div key={aspect.id || "tmp"}>
                {aspect.name}
                {aspect.weight}
            </div>)}
        </div>
        <input type="text" {...bindNewAspect} />
        <Button onClick={() => props.addAspectRequest({aspect: new Aspect(newAspect, 1)})}>Add aspect</Button>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Aspects);
