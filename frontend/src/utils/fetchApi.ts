import { isValid } from "./isValid";
import { RequestState } from "./RequestState";

interface FetchApiProps {
    url: string;
    method?: "POST" | "GET" | "PUT" | "DELETE";
    expectedOutput?: "OTHER" | "JSON" | "OK";
    headers?: HeadersInit;
    body?: BodyInit;
}

export interface fetchApiResponse<T> {
    status: RequestState;
    data: T;
}

export async function fetchApi<T>({
    url,
    method = "GET",
    headers,
    body,
    expectedOutput = "JSON",
}: FetchApiProps): Promise<[boolean, T | null]> {
    try {
        const res = await fetch(url, {
            method: method,
            credentials: "include",
            mode: "cors",
            headers: {
                "X-Requested-With": "Fetch",
                ...headers,
            },
            body: body,
        });

        if (res.ok === false) {
            return [false, null];
        }

        // console.log(res.status);

        if (expectedOutput === "JSON") {
            const json = await res.json();
            return [isValid(json), json];
        } else if (expectedOutput === "OTHER") {
            return [true, (await res.text()) as T];
        } else if (expectedOutput === "OK") {
            return [true, (await res.text()) as T];
        }

        return [false, null];
    } catch (e) {
        console.log(e);
        return [false, null];
    }
}
