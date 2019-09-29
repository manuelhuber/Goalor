import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"
import {css, jc} from "../../../util/style";
import style from "./Barometer.module.scss";
import {completeGoal, Step} from "./duck";

const mapStateToProps = (state: AppState, props: { steps: Step[], goalId: string }) => {
    return {...props};
};

const mapDispatchToProps = {completeGoal};

const Barometer: React.FC<Props> = props => {
    const toggle = (step: Step, stepNumber: number, done: boolean) => {
        props.completeGoal({
            id: props.goalId,
            step: stepNumber,
            done: done
        });
    };
    console.log(style.done);
    const stepCount = props.steps.length;

    const pipeClass = (stepNumber: number): string => {
        const prev = props.steps[stepNumber - 1].done;
        const cur = props.steps[stepNumber].done;
        if (cur) return style.full;
        if (!prev) return style.empty;
        return style.semi;
    };
    return <div>{props.steps.slice(0).reverse().map((step, index) => {
        const stepNumber = stepCount - index - 1;
        return <div key={stepNumber}>
            <div onClick={() => toggle(step, stepNumber, !step.done)} className={style.entryRow}>
                <div className={style.barometerColumn}>
                    <div className={css(style.dot, [style.full, step.done], [style.empty, !step.done])}/>
                </div>
                {step.text}
            </div>
            {stepNumber > 0 && <div className={style.barometerColumn}>
                <div className={jc(style.pipe, pipeClass(stepNumber))}/>
            </div>}
        </div>
    })}
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Barometer);
