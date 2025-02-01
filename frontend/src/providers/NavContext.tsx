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
    selectedDogId: number;
    setSelectedDogId(dogId: number): void;
}

export const NavContext = createContext<NavContextProps>({
    state: NavState.home,
    setState: () => {},
    selectedDogId: -1,
    setSelectedDogId: () => {},
});
