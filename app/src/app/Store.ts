import {configureStore} from "@reduxjs/toolkit";
import {accountReducer} from "app/features/account/duck";
import {gratitudeReducer} from "app/features/gratitude/duck";
import {habitsReducer} from "app/features/habit/duck";
import {notificationReducer} from "app/features/notifications/duck";
import {Action, combineReducers} from "redux";
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
    account: accountReducer,
    habits: habitsReducer
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
const store = configureStore({reducer: reducerWithReset, middleware: [thunkMiddleware], devTools: true});
export default store;
