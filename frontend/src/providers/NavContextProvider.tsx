import { ReactNode, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { NavContext, NavState } from "./NavContext";
import { useNavigate } from "react-router-dom";

interface NavContextProviderProps {
    children?: ReactNode;
}

export default function NavContextProvider({
    children,
}: NavContextProviderProps) {
    const [selected, setSelected] = useLocalStorage<NavState>(
        "nav-bar-state",
        NavState.home
    );
    const [selectedDogId, setSelectedDogiId] = useLocalStorage<
        number | undefined
    >("selected-dog", undefined);

    return (
        <NavContext.Provider
            value={{
                state: selected,
                setState: setSelected,
                selectedDogId: selectedDogId,
                setSelectedDogId: setSelectedDogiId,
            }}
        >
            {children}
        </NavContext.Provider>
    );
}
