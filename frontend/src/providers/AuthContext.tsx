import { createContext } from "react";

interface AuthContextProps {
    authenticated: boolean;
    // user: User;
    login(email: string, password: string): void;
    register(email: string, password: string): void;
    logout(): void;
    checkUserIsLoggedInOnServer(apiResponse: any): void;
}

export const INITIAL_VALUES: AuthContextProps = {
    authenticated: false,
    login: () => {},
    register: () => {},
    logout: () => {},
    checkUserIsLoggedInOnServer: () => {},
};

export const AuthContext = createContext<AuthContextProps>(INITIAL_VALUES);
