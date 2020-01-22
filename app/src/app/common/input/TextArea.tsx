import React from "react";
import {css} from "util/style";

type Props = { label: React.ReactNode, noMargin?: boolean }
const TextArea: React.FC<Props & React.InputHTMLAttributes<HTMLTextAreaElement>> = props => {
    const {noMargin, ...passOnProps} = props;
    return <label className={css("field", ["mb-zero", props.noMargin])}>
        <textarea {...passOnProps} />
        <span className="label">{props.label}</span>
    </label>;
};

export default TextArea;
