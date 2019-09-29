import {Action, Reducer} from "redux";

// State

export type AuthState = {
    authenticated: boolean;
    token?: string;
};

const initialState: AuthState = {authenticated: false};

// Actions

type Authenticate = { authenticated: boolean };
type AuthenticateAction = Authenticate & Action<"AUTHENTICATE">;
export const authenticate = (input: Authenticate): AuthenticateAction => ({type: "AUTHENTICATE", ...input});

type SetToken = { token: string };
type SetTokenAction = SetToken & Action<"SET_TOKEN">;
export const setToken = (input: SetToken): SetTokenAction => ({type: "SET_TOKEN", ...input});

export type AuthAction = AuthenticateAction | SetTokenAction;

// Reducer

export const authReducer: Reducer<AuthState, AuthAction> = (state = initialState, action): AuthState => {
    switch (action.type) {
        case "AUTHENTICATE":
            return {...state, authenticated: action.authenticated};
        case "SET_TOKEN":
            return {...state, token: action.token};
        default:
            return state;
    }
};
