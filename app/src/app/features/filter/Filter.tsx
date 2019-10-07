import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"
import Checkbox from "../../common/Checkbox";
import {resetFilter, setSearchTerm, setTags} from "./duck";

const mapStateToProps = (state: AppState) => {
    const tags = new Set<string>();
    for (let goal of Object.values(state.goals.goals)) {
        goal.types.forEach(tag => tags.add(tag));
    }

    const selected = state.filters.selectedTags;

    return {
        tags: tags,
        selectedTags: selected
    }
};

const mapDispatchToProps = {
    setTags,
    setSearchTerm,
    resetFilter
};

const Filter: React.FC<Props> = props => {
    const tags = Array.from(props.tags.values());
    console.log(props.selectedTags);

    return <div>
        {tags.map(tag => <Checkbox key={tag}
                                   label={tag}
                                   checked={props.selectedTags.includes(tag)}
                                   onChange={() => props.setTags([tag])}/>)}
    </div>;
};

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Filter);
