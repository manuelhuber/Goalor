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
