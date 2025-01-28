import { useState } from "react";

export const JSON_HEADERS = {
    "Content-Type": "application/json",
};

interface UseApiProps {
    url: string;
    method?: "POST" | "GET" | "PUT" | "DELETE";
    expectedOutput?: "TEXT" | "JSON" | "BLOB";
    headers?: HeadersInit;
    body?: BodyInit;
}

export enum RequestState {
    none,
    sent,
    recieved,
    failed,
}

export default function useApi<T>() {
    const [data, SetData] = useState<T | null>(null);
    const [state, setState] = useState<RequestState>(RequestState.none);
    const [isLoading, SetIsLoading] = useState(false);

    const handleFetch = async ({
        url,
        method = "GET",
        expectedOutput = "JSON",
        headers,
        body,
    }: UseApiProps) => {
        SetIsLoading(true);
        setState(RequestState.sent);
        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    "X-Requested-With": "Fetch",
                    ...headers,
                },
                body: body,
                credentials: "include",
                mode: "cors",
            });

            let resData;
            if (expectedOutput === "BLOB") {
                resData = await res.blob();
            } else {
                const str = await res.text();
                if (str !== "OK" && expectedOutput === "JSON") {
                    resData = await JSON.parse(str);
                } else {
                    resData = null;
                }
            }
            SetData(resData);
            setState(RequestState.recieved);
            SetIsLoading(false);
        } catch (e) {
            setState(RequestState.failed);
            console.log(e);
        }
    };

    return { data, state, isLoading, handleFetch };
}
