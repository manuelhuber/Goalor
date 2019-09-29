import React from "react";
import styles from "./SectionTitle.module.scss";

const SectionTitle: React.FC<{ title: string, color: string }> = props => {
    return <div className={styles.title} style={{color: props.color}}>
        {props.title}
        <hr className={styles.titleLine}
            style={{background: `linear-gradient(to right, ${props.color}, rgba(0, 0, 0, 0))`}}/>
    </div>;
};

export default SectionTitle;
