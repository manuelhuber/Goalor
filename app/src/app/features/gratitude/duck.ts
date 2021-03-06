import {Thunk} from "app/Store";
import {Gratitude} from "generated/models";
import {Action, Reducer} from "redux";
import {gratitudeApi} from "util/fetch";

// API calls -----------------------------------------------------------------------------------------------------------

export const createGratitude = (
    title: string,
    date: Date,
    description: string,
    file: File): Thunk => async (dispatch) => {
    gratitudeApi(dispatch).postGratitude({title, date, description, image: file}).then(value => {
        dispatch(addGratitudes([value]))
    });
};

export const deleteGratitude = (id: string): Thunk => async (dispatch) => {
    gratitudeApi(dispatch).deleteGratitudeWithId({id}).then(value => {
        dispatch(removeGratitude(id));
    });
};

export const updateGratitude = (gratitude: Gratitude): Thunk => async (dispatch) => {
    gratitudeApi(dispatch)
    .putGratitudeWithId({id: gratitude.id, gratitudeData: {...gratitude, image: null}})
    .then(value => {
        dispatch(updateGratitudeAction(value));
    });
};

export const loadAllGratitudes = (): Thunk => async (dispatch) => {
    gratitudeApi(dispatch).getGratitude().then(value => dispatch(addGratitudes(value)));
};

// State ---------------------------------------------------------------------------------------------------------------

export type GratitudeState = {
    gratitude: { [id: string]: Gratitude },
    gratitudeSortedByDate: string[]
};

const initialState: GratitudeState = {gratitude: {}, gratitudeSortedByDate: []};

// Actions -------------------------------------------------------------------------------------------------------------

type AddGratitudes = { gratitudes: Gratitude[] };
type AddGratitudesAction = AddGratitudes & Action<'ADD_GRATITUDES'>;
export const addGratitudes = (gratitudes: Gratitude[]): AddGratitudesAction => ({type: 'ADD_GRATITUDES', gratitudes});

type RemoveGratitude = { id: string };
type RemoveGratitudeAction = RemoveGratitude & Action<'REMOVE_GRATITUDE'>;
const removeGratitude = (id: string): RemoveGratitudeAction => ({type: 'REMOVE_GRATITUDE', id});

type UpdateGratitude = { gratitude: Gratitude };
type UpdateGratitudeAction = UpdateGratitude & Action<'UPDATE_GRATITUDE'>;
const updateGratitudeAction = (gratitude: Gratitude): UpdateGratitudeAction => ({type: 'UPDATE_GRATITUDE', gratitude});


export type GratitudeAction = AddGratitudesAction | RemoveGratitudeAction | UpdateGratitudeAction;

// Reducer -------------------------------------------------------------------------------------------------------------

export const gratitudeReducer: Reducer<GratitudeState, GratitudeAction> = (
    state = initialState,
    action): GratitudeState => {
    const newMap = {...state.gratitude};
    switch (action.type) {
        case "ADD_GRATITUDES":
            action.gratitudes.forEach(value => newMap[value.id] = value);
            return {...state, gratitude: newMap, gratitudeSortedByDate: getSortedIds(newMap)};
        case "REMOVE_GRATITUDE":
            delete newMap[action.id];
            const newIds = state.gratitudeSortedByDate.filter(value => value !== action.id);
            return {...state, gratitude: newMap, gratitudeSortedByDate: newIds};
        case "UPDATE_GRATITUDE":
            newMap[action.gratitude.id] = action.gratitude;
            return {...state, gratitude: newMap, gratitudeSortedByDate: getSortedIds(newMap)};
        default:
            return state;
    }
};

function getSortedIds(gratitudes: { [id: string]: Gratitude }): string[] {
    return Object.values(gratitudes)
                 .sort((a, b) => b.date.getTime() - a.date.getTime())
                 .map(value => value.id)
}
