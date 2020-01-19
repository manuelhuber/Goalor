import {Action, Reducer} from "redux";
import {Gratitude} from "generated/models";
import {Thunk} from "app/Store";
import {gratitudeApi} from "util/fetch";

// State

export type GratitudeState = {
    gratitude: { [id: string]: Gratitude },
    gratitudeSortedByDate: string[]
};

const initialState: GratitudeState = {gratitude: {}, gratitudeSortedByDate: []};

// Actions

type AddGratitudes = { gratitudes: Gratitude[] };
type AddGratitudesAction = AddGratitudes & Action<'ADD_GRATITUDES'>;
export const addGratitudes = (gratitudes: Gratitude[]): AddGratitudesAction => ({type: 'ADD_GRATITUDES', gratitudes});

export const loadAllGratitudes = (): Thunk => async (dispatch) => {
    gratitudeApi.getGratitude().then(value => dispatch(addGratitudes(value)));
};


export type GratitudeAction = AddGratitudesAction; // TODO

// Reducer

export const gratitudeReducer: Reducer<GratitudeState, GratitudeAction> = (
    state = initialState,
    action): GratitudeState => {
    switch (action.type) {
        case "ADD_GRATITUDES":
            const newMap = {...state.gratitude};
            action.gratitudes.forEach(value => newMap[value.id] = value);
            return {...state, gratitude: newMap, gratitudeSortedByDate: getSortedIds(newMap)};
        default:
            return state;
    }
};

function getSortedIds(gratitudes: { [id: string]: Gratitude }): string[] {
    return Object.values(gratitudes)
                 .sort((a, b) => a.date.getTime() - b.date.getTime())
                 .map(value => value.id)
}
