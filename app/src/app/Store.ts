import {Action, applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunkMiddleware, {ThunkAction} from "redux-thunk"
import {authReducer} from "./features/auth/duck";
import {goalReducer} from "./features/goals/duck";

const rootReducer = combineReducers({goals: goalReducer, auth: authReducer});

export type AppState = ReturnType<typeof rootReducer>

export type Thunk<R = void> = ThunkAction<Promise<R>, AppState, {}, Action>;

const store = createStore(rootReducer, compose(
    applyMiddleware(thunkMiddleware),
    (<any>window).__REDUX_DEVTOOLS_EXTENSION__ && (<any>window).__REDUX_DEVTOOLS_EXTENSION__())
);

export default store;
