import { useEffect, useState } from "react";

function getLoaclStorageValue<T>(key: string, initVal: T): T {
    const str = localStorage.getItem(key);
    if (str === null) {
        if (initVal instanceof Function) return initVal();

        return initVal;
    }
    const savedVal = JSON.parse(str);
    return savedVal;
}

export default function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        return getLoaclStorageValue(key, initialValue);
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value]);

    return [value, setValue];
}
