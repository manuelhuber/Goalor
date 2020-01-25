import IconButton from "app/common/buttons/IconButton";
import React, {useRef} from "react";
import {MdImage} from "react-icons/all";

export const FileInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = props => {
    const input = useRef<HTMLInputElement>(null);
    let onClick = () => input.current && input.current.click();
    return <>
        <IconButton onClick={onClick}><MdImage/></IconButton>
        <input style={{display: "none"}} ref={input} type="file" {...props}/></>
};
