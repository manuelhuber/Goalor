import {combineReducers, createStore} from "redux";
import {authReducer} from "./features/auth/duck";
import {goalReducer} from "./features/goals/duck";

const rootReducer = combineReducers({goals: goalReducer, auth: authReducer});

export type AppState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer,
    (<any>window).__REDUX_DEVTOOLS_EXTENSION__ && (<any>window).__REDUX_DEVTOOLS_EXTENSION__());

export default store;
