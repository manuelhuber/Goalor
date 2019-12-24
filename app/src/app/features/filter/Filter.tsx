import Checkbox from "app/common/Checkbox";
import {AppState} from "app/Store";
import React from "react";
import {connect} from "react-redux"
import {FilterState, resetFilter, setSearchTerm, toggleTag} from "./duck";

const mapStateToProps = (state: AppState, props: { filters: FilterState, namespace: string }) => {
    const tags = new Set<string>();
    const selected = props.filters.selectedTags;
    return {
        namespace: props.namespace,
        tags: tags,
        selectedTags: selected
    }
};

const mapDispatchToProps = {
    toggleTag,
    setSearchTerm,
    resetFilter
};

const Filter: React.FC<Props> = props =>
    <div>
        {Array.from(props.tags.values()).map(tag =>
            <Checkbox key={tag}
                      label={tag}
                      noMargin={true}
                      checked={props.selectedTags.includes(tag)}
                      onChange={() => props.toggleTag(tag, props.namespace)}/>)}
    </div>;

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(Filter);
