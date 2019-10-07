import React, {ReactNode} from "react";

type Props = { label: ReactNode, expanded: boolean, onChange: (boolean) => void, children: ReactNode };
const Expandable: React.FC<Props> = props => <div>
    <div onClick={() => props.onChange(!props.expanded)}>{props.label}</div>
    {props.expanded && <div>{props.children}</div>}
</div>;

export default Expandable;
