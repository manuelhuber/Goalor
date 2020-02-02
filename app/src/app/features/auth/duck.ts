import {loadAccount} from "app/features/account/duck";
import {loadAllAspects} from "app/features/aspects/duck";
import {loadAllGoals} from "app/features/goals/duck";
import {loadAllGratitudes} from "app/features/gratitude/duck";
import {loadHabits} from "app/features/habit/duck";
import {notify} from "app/features/notifications/duck";
import {Thunk} from "app/Store";
import {ErrorResponse, Registration} from "generated/models";
import {Action, Reducer} from "redux";
import {notifyWithMessage} from "util/duckUtil";
import {authApi, userApi} from "util/fetch";

// Functions to load all data on page load or login
export const DataFetchers = [
    loadAllAspects(),
    loadAllGoals(),
    loadAllGratitudes(),
    loadAccount(),
    loadHabits()
];

// State

export type AuthState = {
    authenticated: boolean;
    token?: string;
    isLoading: boolean;
};

const LOCAL_STORAGE_TOKEN = "GOALOR_KEY";
const initialToken = localStorage.getItem(LOCAL_STORAGE_TOKEN);
const initialState: AuthState = {
    authenticated: !!initialToken,
    token: initialToken || undefined,
    isLoading: false
};

// Actions
export type LoginRequest = { username: string, password: string };
export const login = (req: LoginRequest): Thunk => async (dispatch, getState) => {
    if (getState().auth.token) {
        return Promise.resolve();
    } else {
        dispatch(setLoading(true));
        dispatch(notify({message: "LOGGING IN"}, 3000));
        let password = req.password;
        let username = req.username;
        authApi.postAuthLogin({login: {username, password}}).then(res => {
            if (!res.jwt) return;
            dispatch(setToken({token: res.jwt}));
            DataFetchers.forEach(thunk => dispatch(thunk));
            dispatch(notify({message: "Successfully logged in"}, 1500))
        }).catch((response: ErrorResponse) =>
            dispatch(notify({message: `Error when logging in: ${response.message}`}))
        ).finally(() => dispatch(setLoading(false)));
    }
};

export const register = (req: Registration): Thunk => async (dispatch) =>
    userApi.postUserRegister({registration: req})
           .then(res => {
               dispatch(setLoading(false));
               dispatch(setToken({token: res["token"]}));
               dispatch(loadAllAspects());
               dispatch(loadAllGoals());
           }).catch(notifyWithMessage("Failed to register: ", dispatch));

export const updatePassword = (old: string, newPw: string, token: string = null): Thunk => async (dispatch) => {
    userApi.postUserPassword({passwordUpdate: {old, pw: newPw, token}}).then(value => {
        dispatch(notify({message: "Password updated"}))
    }).catch(notifyWithMessage("Failed to update password: ", dispatch));
};

export const resetPassword = (username: string): Thunk => async (dispatch) => {
    authApi.postAuthResetWithUsername({username}).then(() => {
        dispatch(notify({message: "Reset successful. Check your emails"}))
    });
};


type SetToken = { token: string };
type SetTokenAction = SetToken & Action<"SET_TOKEN">;
export const setToken = (input: SetToken): SetTokenAction => ({type: "SET_TOKEN", ...input});

type SetLoading = { loading: boolean };
type SetLoadingAction = SetLoading & Action<"SET_LOADING">;
export const setLoading = (value: boolean): SetLoadingAction => ({type: "SET_LOADING", loading: value});

type LogoutAction = Action<"LOGOUT">;
export const logoutAction = (): LogoutAction => ({type: "LOGOUT"});
export const logout = (): Thunk => async (dispatch) => {
    authApi.postAuthLogout().then(() => {
        dispatch({type: "RESET"});
        dispatch(logoutAction());
    });
};

export type AuthAction = SetTokenAction | SetLoadingAction | LogoutAction;

// Reducer

export const authReducer: Reducer<AuthState, AuthAction> = (state = initialState, action): AuthState => {
    switch (action.type) {
        case "SET_LOADING":
            return {...state, isLoading: action.loading};
        case "SET_TOKEN":
            localStorage.setItem(LOCAL_STORAGE_TOKEN, action.token);
            return {...state, token: action.token, authenticated: !!action.token};
        case "LOGOUT":
            localStorage.removeItem(LOCAL_STORAGE_TOKEN);
            return {...state, token: undefined, authenticated: false};
        default:
            return state;
    }
};
