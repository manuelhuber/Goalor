import {AspectsApi, AuthApi, GoalsApi} from "generated/apis";
import {Configuration} from "generated";

export const post = (url: string, body?: any, input?: RequestInit) => {
    return myFetch(url, "POST", body, input)
};
export const get = (url: string, input?: RequestInit) => {
    return myFetch(url, "GET", null, input)
};

let configuration = new Configuration({
    accessToken: localStorage.getItem("GOALOR_KEY"),
    basePath: process.env.REACT_APP_BASE_URL,
});

export const aspectApi = new AspectsApi(configuration);
export const goalApi = new GoalsApi(configuration);
export const authApi = new AuthApi(configuration);

export const myFetch = (url: string, method: "POST" | "GET" | "PUT" | "DELETE", body?: any, input?: RequestInit) => {
    const defaultConfig = {
        method: method,
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("GOALOR_KEY")
            }`
        },
    };
    if (body) {
        defaultConfig["body"] = JSON.stringify(body);
    }
    return fetch(`${process.env.REACT_APP_BASE_URL}/${url}`, {
        ...defaultConfig, ...input
    }).then(async response => {
        if (!response.ok) {
            let text;
            try {
                // Try to get json
                // json() & text() can only be called once - so clone first
                text = await response.clone().json();
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
