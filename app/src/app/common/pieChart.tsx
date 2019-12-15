import React, {useEffect, useState} from "react";
import {css} from '../../util/Style';
import style from "./pieChart.module.scss";

export interface CircleEntry {
    percentage: number;
    radius: number; // percentage
    color: string;
}

type Props = { entries: CircleEntry[], size: number }
const PieChart: React.FC<Props> = props => {
    const [isInitialRender, setInitialRender] = useState(true);
    const canvasRef = React.useRef<HTMLCanvasElement>();
    useEffect(() => {
        setInitialRender(false);
        let canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const fullAngle = 2 * Math.PI;
        const center = props.size / 2;
        let start = -.25 * fullAngle; // 0 is the 3 o'clock position. To start at 12 o'clock we need to go back by 25%

        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'rgb(255,255,255)'; // needs to be background color
        ctx.lineWidth = 2;
        ctx.clearRect(0, 0, props.size, props.size);

        for (const entry of props.entries) {
            const end = start + (entry.percentage * fullAngle);
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center,
                (entry.radius * center * .75) + center * .2,
                start, end);
            ctx.lineTo(center, center);
            ctx.fillStyle = entry.color;

            // We want to have a border that's only on the inside so it doesn't overlap with the other regions

            // Save state, do clipping stuff, then restore
            ctx.save();
            // The element of the pie chart is now a clipping area -
            // nothing outside of it gets drawn
            ctx.clip();
            // Paint the area
            ctx.fill();
            // double the stroke width - half of it will be outside, half inside the shape
            // but the outside part won't be drawn because of clipping
            ctx.lineWidth *= 2;
            ctx.stroke();
            ctx.restore();
            start = end;
        }
        canvas.onmousemove = ev => {
        }
    }, [props.size, props.entries]);
    return <canvas className={css(style.initial, [style.notInitial, !isInitialRender])}
        ref={canvasRef}
        width={props.size}
        height={props.size}/>;
};
export default PieChart;


