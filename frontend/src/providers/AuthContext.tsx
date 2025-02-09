import { createContext } from "react";
import { Msg, StatusCode } from "../models/response";

interface AuthContextProps {
    authenticated: boolean;
    lastStatusCode: Msg;
    // user: User;
    login(email: string, password: string): void;
    register(email: string, password: string): void;
    logout(): void;
    checkUserIsLoggedInOnServer(apiResponse: any): void;
}

export const INITIAL_VALUES: AuthContextProps = {
    authenticated: false,
    lastStatusCode: { status: StatusCode.STATUS_INIT },
    login: () => {},
    register: () => {},
    logout: () => {},
    checkUserIsLoggedInOnServer: () => {},
};

export const AuthContext = createContext<AuthContextProps>(INITIAL_VALUES);
