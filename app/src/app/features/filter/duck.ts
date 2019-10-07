import {Action, Reducer} from "redux";
import {Goal} from "../goals/duck";

// State

export type FilterState = {
    selectedTags: string[],
    searchTerm: string,
};

const initialState: FilterState = {
    selectedTags: [],
    searchTerm: ""
};

// Actions

type SetTags = { tags: string[] };
type SetTagsAction = SetTags & Action<"SET_TAGS">;
export const setTags = (tags: string[]): SetTagsAction => ({type: "SET_TAGS", tags});

type SetSearchTerm = { term: string };
type SetSearchTermAction = SetSearchTerm & Action<"SET_SEARCH_TERM">;
export const setSearchTerm = (term: string): SetSearchTermAction => ({type: "SET_SEARCH_TERM", term});

type ResetFilterAction = Action<"RESET_FILTER">;
export const resetFilter = (): ResetFilterAction => ({type: "RESET_FILTER"});

export type FilterAction = SetTagsAction | SetSearchTermAction | ResetFilterAction;

// Reducer

export const filterReducer: Reducer<FilterState, FilterAction> = (state = initialState, action): FilterState => {
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
        default:
            return state;
    }
};

export function filterGoals(filters: FilterState, goals: Goal[]) {
    return goals.filter(goal =>
        filters.selectedTags.length === 0 || goal.types.some(value => filters.selectedTags.includes(value))
    ).filter(goal =>
        filters.searchTerm.length === 0 || goal.title.includes(filters.searchTerm)
    );

}
