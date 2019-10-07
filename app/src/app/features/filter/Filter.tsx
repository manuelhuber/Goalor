import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"
import Checkbox from "../../common/Checkbox";
import {FilterState, resetFilter, setSearchTerm, setTags} from "./duck";

const mapStateToProps = (state: AppState, props: { filters: FilterState, namespace: string }) => {
    const tags = new Set<string>();
    for (let goal of Object.values(state.goals.goals)) {
        goal.types.forEach(tag => tags.add(tag));
    }

    const selected = props.filters.selectedTags;

    return {
        namespace: props.namespace,
        tags: tags,
        selectedTags: selected
    }
};

const mapDispatchToProps = {
    setTags,
    setSearchTerm,
    resetFilter
};

const Filter: React.FC<Props> = props =>
    <div>
        {Array.from(props.tags.values()).map(tag =>
            <Checkbox key={tag}
                      label={tag}
                      checked={props.selectedTags.includes(tag)}
                      onChange={() => props.setTags([tag], props.namespace)}/>)}
    </div>;

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Filter);
