import React from "react";
import {jc} from "util/style";
import styles from "./SectionTitle.module.scss";

const SectionTitle: React.FC<{ title: string, color: string }> = props => {
    return <div className={styles.title} style={{color: props.color}}>
        <h4 className={jc(styles.titleText, "m-zero")}>{props.title}</h4>
        <hr className={styles.titleLine}
            style={{background: `linear-gradient(to right, ${props.color}, rgba(0, 0, 0, 0))`}}/>
    </div>;
};

export default SectionTitle;
