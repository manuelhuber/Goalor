import React from "react";

type Props = { children: React.ReactNode, onClick: () => void }
const IconButton: React.FC<Props> = props =>
    <button onClick={props.onClick} className={"toolbar-button js-toolbar-toggle -small"}>
        {props.children}
    </button>;

export default IconButton;
