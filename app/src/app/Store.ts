import {Action, applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunkMiddleware, {ThunkAction} from "redux-thunk"
import {authReducer} from "./features/auth/duck";
import {goalReducer} from "./features/goals/duck";
import {aspectsReducer} from './features/aspects/duck';

const rootReducer = combineReducers({goals: goalReducer, auth: authReducer, aspects: aspectsReducer});

export type AppState = ReturnType<typeof rootReducer>

export type Thunk<R = void> = ThunkAction<Promise<R>, AppState, {}, Action>;

const store = createStore(rootReducer, compose(
    applyMiddleware(thunkMiddleware),
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__())
);

export default store;
