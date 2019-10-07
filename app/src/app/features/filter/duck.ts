import {NamespacedAction} from "model/NamespacedAction";
import {Reducer} from "redux";

// State

export type FilterState = {
    selectedTags: string[],
    searchTerm: string,
};

export const emptyFilterState = (): FilterState => ({
    selectedTags: [],
    searchTerm: ""
});

// Actions

type SetTags = { tags: string[] };
type SetTagsAction = SetTags & NamespacedAction<"SET_TAGS">;
export const setTags = (tags: string[], namespace: string): SetTagsAction => ({namespace, type: "SET_TAGS", tags});

type ToggleTag = { tag: string };
type ToggleTagAction = ToggleTag & NamespacedAction<"TOGGLE_TAG">;
export const toggleTag = (tag: string, namespace: string): ToggleTagAction => ({namespace, type: "TOGGLE_TAG", tag});

type SetSearchTerm = { term: string };
type SetSearchTermAction = SetSearchTerm & NamespacedAction<"SET_SEARCH_TERM">;
export const setSearchTerm = (term: string, namespace: string): SetSearchTermAction => ({
    namespace,
    type: "SET_SEARCH_TERM",
    term
});

type ResetFilterAction = NamespacedAction<"RESET_FILTER">;
export const resetFilter = (namespace: string): ResetFilterAction => ({namespace, type: "RESET_FILTER"});

export type FilterAction = SetTagsAction | SetSearchTermAction | ResetFilterAction | ToggleTagAction;

// Reducer

export const filterReducer: Reducer<FilterState, FilterAction> = (state = emptyFilterState(), action): FilterState => {
    switch (action.type) {
        case "SET_TAGS":
            return {...state, selectedTags: action.tags};
        case "SET_SEARCH_TERM":
            return {...state, searchTerm: action.term};
        case "RESET_FILTER":
            return {
                ...state,
                searchTerm: "",
                selectedTags: []
            };
        case "TOGGLE_TAG":
            let selectedTags;
            if (state.selectedTags.includes(action.tag)) {
                selectedTags = state.selectedTags.without(action.tag);
            } else {
                selectedTags = state.selectedTags.concat(action.tag);
            }
            return {...state, selectedTags: selectedTags};
        default:
            return state;
    }
};
