import App from "app/App";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "./style/cutestrap.scss";
import "./style/styleConstants.scss";
import "./util/array";

ReactDOM.render(<App/>, document.getElementById("root"));

// If you want your de.manuelhuber.purpose.app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
