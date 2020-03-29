import {logoutAction} from "app/features/auth/duck";
import {notify} from "app/features/notifications/duck";
import {AppState} from "app/Store";

import {BaseAPI, Configuration, HabitsApi} from "generated";
import {AspectsApi, AuthApi, GoalsApi, GratitudeApi, UserApi} from "generated/apis";
import {Action, Dispatch} from "redux";
import {ThunkDispatch} from "redux-thunk";

export const post = (dispatch: ThunkDispatch<AppState, {}, Action>, url: string, body?: any, input?: RequestInit) => {
    return myFetch(null, url, "POST", body, input)
};

async function handleError(response: Response, dispatch: ThunkDispatch<AppState, {}, Action>) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    if (response.status === 401
        // don't logout if the reset PW endpoint throws a 401
        && response.url.indexOf("/user/password") === -1) {
        dispatch(logoutAction());
    }
    let errorResponse = await response.json();
    dispatch(notify({message: "Error: " + (errorResponse.message || errorResponse.toString())}));
    throw (errorResponse);
}

let configuration = (dispatch: ThunkDispatch<AppState, {}, Action>) => new Configuration({
    accessToken: () => localStorage.getItem("GOALOR_KEY"),
    basePath: process.env.REACT_APP_BASE_URL,
    middleware: [{
        post: async context => {
            return await handleError(context.response, dispatch);
        }
    }]
});

function configApi<T extends BaseAPI>(Api: new (Configuration) => T): (Dispatch) => T {
    return (dispatch: Dispatch): T => new Api(configuration(dispatch));
}

export const aspectApi = configApi(AspectsApi);
export const goalApi = configApi(GoalsApi);
export const authApi = configApi(AuthApi);
export const userApi = configApi(UserApi);
export const gratitudeApi = configApi(GratitudeApi);
export const habitApi = configApi(HabitsApi);

const myFetch = (dispatch: ThunkDispatch<AppState, {}, Action>,
                 url: string,
                 method: "POST" | "GET" | "PUT" | "DELETE",
                 body?: any,
                 input?: RequestInit) => {
    const defaultConfig = {
        method: method,
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("GOALOR_KEY")
            }`
        },
    };
    if (body) {
        defaultConfig["body"] = body instanceof FormData ? body : JSON.stringify(body);
    }
    return fetch(`${process.env.REACT_APP_BASE_URL}/${url}`, {
        ...defaultConfig, ...input
    })
    .then(async respone => handleError(respone.clone(), dispatch))
    .then(async response => {
        if (!response.ok) {
            let text;
            try {
                // Try to get json
                // json() & text() can only be called once - so clone first
                // @ts-ignore
                text = (await response.clone().json()).message;
            } catch (e) {
                try {
                    // response might not be json but just text
                    text = await response.text()
                } catch (e) {
                    // Fallback is just the HTTP status text...
                    text = response.statusText;
                }
            }
            throw Error(text);
        }
        return await response.json();
    });
};
