import { createContext } from "react";

export enum NavState {
    home,
    profile,
    matches,
    myDogs,
}

interface NavContextProps {
    state: NavState;
    setState(state: NavState): void;
    selectedDogId: number | undefined;
    setSelectedDogId(dogId: number | undefined): void;
}

export const NavContext = createContext<NavContextProps>({
    state: NavState.home,
    setState: () => {},
    selectedDogId: undefined,
    setSelectedDogId: () => {},
});
