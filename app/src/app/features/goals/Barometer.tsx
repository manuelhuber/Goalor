import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"
import {css} from "util/style";
import style from "./Barometer.module.scss";
import {Goal} from "generated/models";

const mapStateToProps = (state: AppState, props: { steps: Goal[], goalId: string }) => {
    return {...props};
};

const mapDispatchToProps = {};

const Barometer: React.FC<Props> = props => {
    const toggle = (step: Goal, stepNumber: number, done: boolean) => console.log("TODO");
    const stepCount = props.steps.length;

    const pipeClass = (stepNumber: number): string => {
        const prev = props.steps[stepNumber - 1].done;
        const cur = props.steps[stepNumber].done;
        if (cur) return style.full;
        if (!prev) return style.empty;
        return style.semi;
    };
    return <div className={style.root}>{props.steps.slice(0).reverse().map((step, index) => {
        const stepNumber = stepCount - index - 1;
        return <div key={stepNumber}>
            <div onClick={() => toggle(step, stepNumber, !step.done)} className={style.entryRow}>
                <div className={style.barometerColumn}>
                    <div className={css(style.dot, [style.full, step.done], [style.empty, !step.done])}/>
                </div>
                {step.title}
            </div>
            {stepNumber > 0 && <div className={style.barometerColumn}>
                <div className={css(style.pipe, pipeClass(stepNumber))}/>
            </div>}
        </div>
    })}
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Barometer);
