import {Thunk} from "app/Store";
import {Action, Reducer} from "redux";
import {replaceByComp, without} from "util/array";
import {Aspect} from "./models";

// State
export type AspectsState = {
    aspects: Aspect[]
};

const initialState: AspectsState = {
    aspects: [
        {name: "Health", weight: 3, completed: .50, id: "1", color: "red"},
        {name: "Career", weight: 4, completed: 1, id: "2", color: "blue"},
        {name: "Hobbies", weight: 2, completed: .33, id: "3", color: "green"},
        {name: "Charity", weight: 1, completed: .0, id: "4", color: "purple"}
    ]
};

// Actions
type AddAspect = { aspect: Aspect };
type AddAspectAction = AddAspect & Action<"ADD_ASPECT">;
const addAspectAction = (aspect: Aspect): AddAspectAction => ({type: "ADD_ASPECT", aspect});

export const addAspect = (tmp: Aspect): Thunk => async (dispatch) => {
    // Instantly add the new aspect to make it snappy
    dispatch(addAspectAction(tmp));

    // Call backend
    setTimeout(() => {
        dispatch(removeAspect(tmp));
        dispatch(addAspectAction(new Aspect(
            tmp.name + "from backend", tmp.weight, Math.random().toString(), 0
        )));
    }, 2000);
};

type RemoveAspect = { aspect: Aspect };
type RemoveAspectAction = RemoveAspect & Action<"REMOVE_ASPECT">;
export const removeAspect = (aspect: Aspect): RemoveAspectAction => ({type: "REMOVE_ASPECT", aspect});

type UpdateAspect = { aspect: Aspect };
type UpdateAspectAction = UpdateAspect & Action<"UPDATE_ASPECT">;
export const updateAspect = (aspect: Aspect): UpdateAspectAction => ({type: "UPDATE_ASPECT", aspect});

export type AspectsAction = AddAspectAction | RemoveAspectAction | UpdateAspectAction;

// Reducer

export const aspectsReducer: Reducer<AspectsState, AspectsAction> = (state = initialState, action): AspectsState => {
    switch (action.type) {
        case "ADD_ASPECT":
            return {...state, aspects: [action.aspect, ...state.aspects]};
        case "REMOVE_ASPECT":
            return {...state, aspects: without(state.aspects, action.aspect)};
        case "UPDATE_ASPECT":
            return {...state, aspects: replaceByComp(state.aspects, action.aspect, aspect => aspect.id)};
        default:
            return state;
    }
};
