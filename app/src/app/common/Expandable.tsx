import React, {ReactNode, useEffect, useRef, useState} from "react";
import styled from "styled-components";

type Props = { expanded: boolean, children: ReactNode };
const Expandable: React.FC<Props> = props => {
    const expand = props.expanded;
    const [heightTimeout, setHeightTimeout] = useState(null);
    const [initialRender, setInitialRender] = useState(true);
    const [height, setHeight] = useState(expand ? "auto" : 0);
    const content = useRef<HTMLDivElement>(null);
    useEffect(() => {
        clearTimeout(heightTimeout);
        if (initialRender) {
            setInitialRender(false);
            return;
        }
        if (!content.current) return;
        if (expand) {
            setHeight(content.current.offsetHeight);
            setHeightTimeout(setTimeout(() => setHeight("auto"), animationDuration));
        } else {
            setHeight(content.current.offsetHeight);
            setTimeout(() => setHeight(0), 0);
        }
    }, [expand]);
    return <Drawer style={{height}}>
        <div ref={content}>{props.children}</div>
    </Drawer>;
};
export default Expandable;
let animationDuration = 350;
const Drawer = styled.div`
transition: height ${animationDuration}ms ease;
overflow: hidden;
`;
