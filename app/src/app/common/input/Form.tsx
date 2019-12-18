import React from "react";

type Props = { onSubmit, children }
const Form: React.FC<Props> = props => <form onSubmit={props.onSubmit} className="wrapper -thin">
    {/* Hidden button so that pressing enter actually does the onSubmit action instead of the first button */}
    <button style={{visibility: "hidden"}}/>
    {props.children}
</form>;

export default Form;
