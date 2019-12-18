import {Action, Reducer} from "redux";
import {Thunk} from "app/Store";

// State

export type NotificationState = {
    message?: string,
    showMessage: boolean
};

const initialState: NotificationState = {message: "test", showMessage: false};

// Actions

type Notify = { message: string };
type NotifyAction = Notify & Action<"NOTIFY">;
const notifyAction = (input: Notify): NotifyAction => ({type: "NOTIFY", ...input});

let timeout = null;
export const notify = (message: Notify, timeToLive?: number): Thunk => async (dispatch) => {
    dispatch(notifyAction(message));
    clearTimeout(timeout);
    timeout = timeToLive ? setTimeout(() => dispatch(clearNotification()), timeToLive) : null;
};


type ClearAction = Action<"CLEAR">;
export const clearNotification = (): ClearAction => ({type: "CLEAR"});

export type NotificationAction = NotifyAction | ClearAction;

// Reducer

export const notificationReducer: Reducer<NotificationState, NotificationAction> = (state = initialState, action): NotificationState => {
    switch (action.type) {
        case "NOTIFY":
            return {...state, message: action.message, showMessage: true};
        case "CLEAR":
            return {...state, showMessage: false};
        default:
            return state;
    }
};
