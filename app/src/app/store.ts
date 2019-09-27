import {combineReducers, createStore} from "redux";
import {goalReducer} from "../goals/duck";

const rootReducer = combineReducers({goals: goalReducer});

export type AppState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer,
    (<any>window).__REDUX_DEVTOOLS_EXTENSION__ && (<any>window).__REDUX_DEVTOOLS_EXTENSION__());

export default store;
