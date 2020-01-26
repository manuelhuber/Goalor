import {accountReducer} from "app/features/account/duck";
import {gratitudeReducer} from "app/features/gratitude/duck";
import {notificationReducer} from "app/features/notifications/duck";
import {Action, applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunkMiddleware, {ThunkAction} from "redux-thunk"
import {aspectsReducer} from "./features/aspects/duck";
import {authReducer} from "./features/auth/duck";
import {goalReducer} from "./features/goals/duck";

const rootReducer = combineReducers({
    goals: goalReducer,
    auth: authReducer,
    aspects: aspectsReducer,
    notifications: notificationReducer,
    gratitude: gratitudeReducer,
    account: accountReducer
});

const reducerWithReset: typeof rootReducer = (state, action) => {
    if (action.type === "RESET") {
        return rootReducer(undefined, action);
    } else {
        return rootReducer(state, action);
    }
};

export type AppState = ReturnType<typeof reducerWithReset>

export type Thunk<R = void> = ThunkAction<Promise<R>, AppState, {}, Action>;

const store =
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ ?
        createStore(reducerWithReset, compose(
            applyMiddleware(thunkMiddleware),
            (window as any).__REDUX_DEVTOOLS_EXTENSION__())
        ) : createStore(reducerWithReset, applyMiddleware(thunkMiddleware));

export default store;
