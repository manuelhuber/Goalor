import React from "react";
import {css} from "util/style";
import styles from "./SectionTitle.module.scss";

const SectionTitle: React.FC<{ title: string, color: string }> = props => {
    return <header className={styles.title} style={{color: props.color}}>
        <h4 className={css(styles.titleText, "m-zero")}>{props.title}</h4>
        <hr className={styles.titleLine}
            style={{background: `linear-gradient(to right, ${props.color}, rgba(0, 0, 0, 0))`}}/>
    </header>;
};

export default SectionTitle;
