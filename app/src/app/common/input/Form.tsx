import React from "react";
import commonStyle from "style/Common.module.scss";

type Props = { onSubmit, children }
const Form: React.FC<Props> = props => <form onSubmit={(e) => {
    e.preventDefault(); // To prevent page reloads
    props.onSubmit()
}} className="wrapper -thin">
    {/* Hidden button so that pressing enter actually does the onSubmit action instead of the first button */}
    <button className={commonStyle.hidden}/>
    {props.children}
</form>;

export default Form;
