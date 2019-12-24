import {notify} from "app/features/notifications/duck";
import {authApi, post} from "app/lib/fetch";
import {Thunk} from "app/Store";
import {Action, Reducer} from "redux";

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
    token: initialToken,
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
            dispatch(setToken({token: res["jwt"]}));
            dispatch(notify({message: "Successfully logged in"}, 1500))
        }).catch(async (reason: Response) =>
            dispatch(notify({message: `Error when logging in: ${(await reason.json()).message}`}))
        ).finally(() => dispatch(setLoading(false)));
    }
};

export type RegisterRequest = { username: string, password: string, email: string };
export const register = (req: RegisterRequest): Thunk => async (dispatch) => {
    post("register", {email: req.email, password: req.password}).then(res => {
        dispatch(setLoading(false));
        dispatch(setToken({token: res["token"]}));
    });
};

type SetToken = { token: string };
type SetTokenAction = SetToken & Action<"SET_TOKEN">;
export const setToken = (input: SetToken): SetTokenAction => ({type: "SET_TOKEN", ...input});

type SetLoading = { loading: boolean };
type SetLoadingAction = SetLoading & Action<"SET_LOADING">;
export const setLoading = (value: boolean): SetLoadingAction => ({type: "SET_LOADING", loading: value});

type LogoutAction = Action<"LOGOUT">;
export const logout = (): LogoutAction => ({type: "LOGOUT"});

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
            return {...state, token: null, authenticated: false};
        default:
            return state;
    }
};
