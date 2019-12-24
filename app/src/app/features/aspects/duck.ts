import {Thunk} from "app/Store";
import {Action, Reducer} from "redux";
import {aspectApi, get} from "app/lib/fetch";
import {notify} from "app/features/notifications/duck";
import {Aspect, CreateAspect} from "generated/models";

// State
export type AspectsState = {
    aspectsById: { [id: string]: Aspect }
};

const initialState: AspectsState = {
    aspectsById: {}
};

// Actions
type AddAspect = { aspect: Aspect };
type AddAspectAction = AddAspect & Action<"ADD_ASPECT">;
const addAspectAction = (aspect: Aspect): AddAspectAction => ({type: "ADD_ASPECT", aspect});

type RemoveAspect = { id: string };
type RemoveAspectAction = RemoveAspect & Action<"REMOVE_ASPECT">;
export const removeAspect = (id: string): RemoveAspectAction => ({type: "REMOVE_ASPECT", id});

type UpdateAspect = { aspect: Aspect };
type UpdateAspectAction = UpdateAspect & Action<"UPDATE_ASPECT">;
export const updateAspectAction = (aspect: Aspect): UpdateAspectAction => ({type: "UPDATE_ASPECT", aspect});

export type AspectsAction = AddAspectAction | RemoveAspectAction | UpdateAspectAction;

export const loadAllAspects = (): Thunk => async (dispatch) =>
    get("aspects")
    .then((aspects: Aspect[]) =>
        aspects.forEach(aspect => dispatch(addAspectAction(aspect)))
    ).catch(x => dispatch(notify({message: "Error loading aspect"})));

export const updateAspect = (aspect: Aspect): Thunk => async (dispatch) => {
    aspectApi.putAspectsWithId({id: aspect.id, createAspect: aspect})
             .then((value: Aspect) => dispatch(updateAspectAction(value)));
};

export const deleteAspect = (id: string): Thunk => async (dispatch) => {
    aspectApi.deleteAspectsWithId({id})
             .then(() => dispatch(removeAspect(id)));
};

export const createAspect = (create: CreateAspect): Thunk => async (dispatch) => {
    aspectApi.postAspects({createAspect: create})
             .then(x => dispatch(addAspectAction(x)))
             .catch(() => dispatch(notify({message: "Error creating aspect"})));
};

// Reducer

export const aspectsReducer: Reducer<AspectsState, AspectsAction> = (state = initialState, action): AspectsState => {
    const newAspects = {...state.aspectsById};
    switch (action.type) {
        case "ADD_ASPECT":
            newAspects[action.aspect.id] = action.aspect;
            return {...state, aspectsById: newAspects};
        case "REMOVE_ASPECT":
            delete newAspects[action.id];
            return {...state, aspectsById: newAspects};
        case "UPDATE_ASPECT":
            newAspects[action.aspect.id] = action.aspect;
            return {...state, aspectsById: newAspects};
        default:
            return state;
    }
};
