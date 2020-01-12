import commonStyle from "style/Common.module.scss";
import React from "react";
import {css} from "util/style";

type Props = {
    checked: boolean;
    label?: string,
    onChange?: (newValue: boolean) => void
    disable?: boolean;
    value?: string;
    noMargin?: boolean;
    inline?: boolean;
}
const Checkbox: React.FC<Props> = props =>
    <label className={css("field", ["mb-zero", props.noMargin], [commonStyle.inline, props.inline])}>
        <input type="checkbox"
               disabled={props.disable}
               value={props.value}
               checked={props.checked}
               onChange={(event) => {
                   props.onChange && props.onChange(event.target.checked);
               }}/>
        <span className='label'>{props.label}</span>
    </label>;

export default Checkbox;
