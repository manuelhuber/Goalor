import {AppState} from "app/Store";
import React, {useState} from "react";
import {connect} from "react-redux"
import {jc} from "util/style";
import styles from "./GoalCard.module.scss"

const mapStateToProps = (state: AppState, ownProps: { title: string, content?: string }) => ownProps;
const mapDispatchToProps = {};
type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const GoalCard: React.FC<Props> = props => {
    const [isToggled, setToggle] = useState(false);
    const {title, content} = props;

    return <div className={jc(styles.card, styles.border)}>
        <div onClick={() => setToggle(!isToggled)}><h6 className={styles.title}>{title}</h6></div>
        {isToggled && <div>{content}</div>}
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(GoalCard);
