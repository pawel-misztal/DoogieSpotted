import { createContext } from "react";

export interface DefaultBackgroundContextProps {
    scrollToTop: () => void;
}

export const DefaultBackgroundContext =
    createContext<DefaultBackgroundContextProps>({
        scrollToTop: () => {},
    });
