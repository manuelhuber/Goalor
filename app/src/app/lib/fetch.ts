export const post = (url: string, body?: any, input?: RequestInit) => {
    const defaultConfig = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("GOALOR_KEY")
            }`
        },
        body: JSON.stringify(body)
    };
    return fetch(`${process.env.REACT_APP_BASE_URL}/${url}`, {
        ...defaultConfig, ...input
    }).then(async response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return await response.json();
    });
};
