import {Action, Reducer} from "redux";
import {Aspect} from "./models";
import {Thunk} from "app/Store";
import {without} from "util/array";

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
const addAspect = (aspect: Aspect): AddAspectAction => ({type: "ADD_ASPECT", aspect});

export const addAspectRequest = (req: AddAspect): Thunk => async (dispatch) => {
    const tmp = req.aspect;
    // Instantly add the new aspect to make it snappy
    dispatch(addAspect(tmp));

    // Call backend
    setTimeout(() => {
        dispatch(removeAspect(tmp));
        if (false && Math.random() > 0.5) {
            // Error
            console.log("ERROR!")
        } else {
            // Success
            dispatch(addAspect(new Aspect(
                tmp.name + "from backend", tmp.weight, Math.random().toString(), 0
            )));
        }
    }, 2000);
};

type RemoveAspect = { aspect: Aspect };
type RemoveAspectAction = RemoveAspect & Action<"REMOVE_ASPECT">;
export const removeAspect = (aspect: Aspect): RemoveAspectAction => ({type: "REMOVE_ASPECT", aspect});

export type AspectsAction = AddAspectAction | RemoveAspectAction;

// Reducer

export const aspectsReducer: Reducer<AspectsState, AspectsAction> = (state = initialState, action): AspectsState => {
    switch (action.type) {
        case "ADD_ASPECT":
            return {...state, aspects: [action.aspect, ...state.aspects]};
        case "REMOVE_ASPECT":
            return {...state, aspects: without(state.aspects, action.aspect)};
        default:
            return state;
    }
};
