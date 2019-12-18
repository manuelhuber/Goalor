import style from "app/common/PieChart.module.scss";
import React, {useEffect, useState} from "react";
import {css} from "util/style";

export interface PieChartEntry {
    percentage: number;
    radius: number; // percentage
    color: string;
    onClick?: () => void
}

type Props = { entries: PieChartEntry[], size: number, animationOnDataChange?: boolean }
const PieChart: React.FC<Props> = props => {
    const {entries, size, animationOnDataChange = false} = props;
    const [hideChart, setHideChart] = useState(true);
    const [hover, setHover] = useState(-1);
    const canvasRef = React.useRef<HTMLCanvasElement>();
    const entryPaths = addPaths(entries, size / 2);

    const appear = () => {
        if (!animationOnDataChange) return;
        setHideChart(true);
        // this causes the component to be drawn with hideChart=true first, then with hideChart=false which causes
        // the CSS transition to take effect
        setTimeout(() => setHideChart(false), 20);

    };

    const redraw = () => {
        setHideChart(false);
        let canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        // double the stroke width you actually want since half of it will be outside & half inside the shape
        // but the outside part won't be drawn because of clipping
        ctx.lineWidth = 4;
        ctx.clearRect(0, 0, size, size);
        ctx.strokeStyle = "rgb(255,255,255)"; // needs to be background color

        for (let i = 0; i < entryPaths.length; i++) {
            const path = entryPaths[i][1];
            ctx.fillStyle = entryPaths[i][0].color;

            // Save/restore state, so we can do clipping without affecting the other entries
            ctx.save();
            if (hover === i) {
                ctx.strokeStyle = ctx.fillStyle;
            }
            // We want to have a border that's only on the inside so it doesn't overlap with the other regions
            // The element of the pie chart is now a clipping area - nothing outside of it gets drawn
            ctx.clip(path);
            // Paint the area
            ctx.fill(path);
            ctx.stroke(path);
            ctx.restore();

        }

        canvas.onmousemove = ev => {
            const hit = entryPaths.find(path => ctx.isPointInPath(path[1], ev.offsetX, ev.offsetY));
            setHover(entryPaths.indexOf(hit));
        };

        canvas.onclick = ev => {
            const hit = entryPaths.find(path => ctx.isPointInPath(path[1], ev.offsetX, ev.offsetY));
            if (hit && hit[0].onClick) hit[0].onClick();
        };

    };

    // Redraw when size, entries or hover changes
    useEffect(redraw, [size, entries, hover]);
    // Cause appear animation when entries change (if animationOnDataChange=true)
    useEffect(appear, [props.entries]);

    return <canvas className={css(style.initial, [style.notInitial, !hideChart])}
                   ref={canvasRef}
                   width={props.size}
                   height={props.size}/>;
};
export default PieChart;


function addPaths(entries: PieChartEntry[], halfSize: number): [PieChartEntry, Path2D][] {
    const minRadius = halfSize * .2; // entries with complete=0 still should show a bit
    const flexibleRadius = halfSize * .75; // This is added to the radius depending on the completed amount
    // The max radius is minRadius+flexibleRadius (which should be less than halfSize to avoid clipping issues)
    const fullAngle = 2 * Math.PI;
    let start = -.25 * fullAngle; // 0 is the 3 o'clock position. To start at 12 o'clock we need to go back by 25%
    return entries.map(entry => {
        const end = start + (entry.percentage * fullAngle);
        const path = new Path2D();
        path.moveTo(halfSize, halfSize);
        path.arc(halfSize, halfSize,
            (entry.radius * flexibleRadius) + minRadius,
            start, end);
        path.lineTo(halfSize, halfSize);
        start = end;
        return [entry, path];
    });

}
