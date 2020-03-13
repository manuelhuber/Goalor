import {notify} from "app/features/notifications/duck";
import {Thunk} from "app/Store";
import {Gratitude, GratitudeFromJSON} from "generated/models";
import {Action, Reducer} from "redux";
import {gratitudeApi, myFetch} from "util/fetch";

// API calls -----------------------------------------------------------------------------------------------------------

export const createGratitude = (
    title: string,
    date: string,
    description: string,
    file: File): Thunk => async (dispatch) => {
    const data = new FormData();
    data.append("image", file);
    data.append("title", title);
    data.append("date", date);
    data.append("description", description);
    myFetch("gratitude", "POST", data).then(e => {
        dispatch(addGratitudes([GratitudeFromJSON(e)]))
    }).catch(reason => {
        dispatch(notify({message: reason.message}))
    });
};

export const deleteGratitude = (id: string): Thunk => async (dispatch) => {
    gratitudeApi.deleteGratitudeWithId({id}).then(value => {
        dispatch(removeGratitude(id));
    });
};

export const updateGratitude = (gratitude: Gratitude): Thunk => async (dispatch) => {
    gratitudeApi.putGratitudeWithId({id: gratitude.id, gratitudeData: {...gratitude}}).then(value => {
        dispatch(updateGratitudeAction(value));
    });
};

export const loadAllGratitudes = (): Thunk => async (dispatch) => {
    gratitudeApi.getGratitude().then(value => dispatch(addGratitudes(value)));
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
