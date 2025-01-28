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

export default function useApi<T>() {
    const [data, SetData] = useState<T | null>(null);
    const [isOk, setIsOk] = useState<boolean>(false);
    const [isLoading, SetIsLoading] = useState(false);

    const handleFetch = async ({
        url,
        method = "GET",
        expectedOutput = "JSON",
        headers,
        body,
    }: UseApiProps) => {
        SetIsLoading(true);
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
            setIsOk(res.ok);
            SetIsLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    return { data, isOk, isLoading, handleFetch };
}
