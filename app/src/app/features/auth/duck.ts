import {Action, Reducer} from "redux";
import {ThunkAction} from "redux-thunk";
import {AppState, Thunk} from "app/Store";

// State

export type AuthState = {
    authenticated: boolean;
    token?: string;
    isLoading: boolean;
};

const initialState: AuthState = {authenticated: true, isLoading: false};

// Actions
export type LoginRequest = { username: string, password: string };
export const login = (req: LoginRequest): ThunkAction<Promise<void>, AppState, {}, Action> => {
    return async (dispatch, getState) => {
        if (getState().auth.token) {
            return Promise.resolve();
        } else {
            dispatch(setLoading(true));
            setTimeout(() => {
                dispatch(setLoading(false));
                dispatch(setToken({token: "fakeToken"}));
            }, 1000);
        }
    };
};

export type RegisterRequest = { username: string, password: string, email: string };
export const register = (req: RegisterRequest): Thunk => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        setTimeout(() => {
            dispatch(setLoading(false));
            dispatch(setToken({token: "fakeToken"}));
        }, 1000);
    };
};

type SetToken = { token: string };
type SetTokenAction = SetToken & Action<"SET_TOKEN">;
export const setToken = (input: SetToken): SetTokenAction => ({type: "SET_TOKEN", ...input});

type SetLoading = { loading: boolean };
type SetLoadingAction = SetLoading & Action<"SET_LOADING">;
export const setLoading = (value: boolean): SetLoadingAction => ({type: "SET_LOADING", loading: value});

export type AuthAction = SetTokenAction | SetLoadingAction;

// Reducer

export const authReducer: Reducer<AuthState, AuthAction> = (state = initialState, action): AuthState => {
    switch (action.type) {
        case "SET_LOADING":
            return {...state, isLoading: action.loading};
        case "SET_TOKEN":
            return {...state, token: action.token, authenticated: !!action.token};
        default:
            return state;
    }
};
