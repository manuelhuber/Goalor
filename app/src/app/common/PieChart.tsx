import style from "app/common/PieChart.module.scss";
import React, {useEffect, useState} from "react";
import {backgroundColor} from "style/styleConstants";
import {jc} from "util/style";

export interface PieChartEntry {
    percentage: number; // percentage number between 0 and 1
    radius: number; // percentage number between 0 and 1
    color: string;
    onClick?: () => void
}

type Props = { entries: PieChartEntry[], size: number, animationOnDataChange?: boolean }
const PieChart: React.FC<Props> = props => {
    const {entries, size, animationOnDataChange = false} = props;
    const [hideChart, setHideChart] = useState(true);
    const [hover, setHover] = useState(-1);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
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
        if (!ctx) return;

        // double the stroke width you actually want since half of it will be outside & half inside the shape
        // but the outside part won't be drawn because of clipping
        ctx.lineWidth = 2;
        ctx.clearRect(0, 0, size, size);
        ctx.strokeStyle = backgroundColor;

        for (let i = 0; i < entryPaths.length; i++) {
            const path = entryPaths[i][1];
            ctx.fillStyle = entryPaths[i][0].color;
            ctx.fill(path);
            ctx.stroke(path);
        }
        if (hover !== -1) {
            // Draw the hovered element again, since it's bigger and on top
            const path = entryPaths[hover][1];
            ctx.fillStyle = entryPaths[hover][0].color;
            ctx.lineWidth = 4;
            ctx.stroke(path);
            ctx.lineWidth = 2;
            ctx.strokeStyle = ctx.fillStyle;
            ctx.fill(path);
            ctx.stroke(path);
        }

        canvas.onmousemove = ev => {
            const hit = entryPaths.find(path => ctx.isPointInPath(path[1], ev.offsetX, ev.offsetY));
            if (hit) {
                setHover(entryPaths.indexOf(hit));
            } else {
                setHover(-1);
            }
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

    return <canvas className={jc(style.initial, [style.notInitial, !hideChart])}
                   ref={canvasRef}
                   width={props.size}
                   height={props.size}/>;
};
export default PieChart;


function addPaths(entries: PieChartEntry[], halfSize: number): [PieChartEntry, Path2D][] {
    const minRadius = halfSize * .33; // entries with complete=0 still should show a bit
    const flexibleRadius = halfSize * .65; // This is added to the radius depending on the completed amount
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
        // To make the center-corner stroke nice we have to draw that corner full (l_ != L)
        path.arc(halfSize, halfSize,
            (entry.radius * flexibleRadius) + minRadius,
            start, end);
        start = end;
        return [entry, path];
    });

}
