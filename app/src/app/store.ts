import {combineReducers, createStore, Reducer} from "redux";
import {goalReducer} from "../goals/duck";

const initialState = {'bar': 42};

const mainReducer: Reducer = (state = initialState, action) => {
    console.log(state);
    return state;
};


const rootReducer = combineReducers({foo: mainReducer, goals: goalReducer});

export type AppState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer);

export default store;
