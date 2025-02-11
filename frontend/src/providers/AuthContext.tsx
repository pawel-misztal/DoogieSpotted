import { createContext } from "react";
import { Msg, StatusCode } from "../models/response";
import { UserResponseModel } from "../models/userResponseModel";
import { RequestState } from "../utils/RequestState";

interface AuthContextProps {
    authenticated: boolean;
    lastStatusCode: Msg;
    // user: User;
    login(email: string, password: string): void;
    loginState: RequestState;
    register(email: string, password: string): void;
    registerState: RequestState;
    logout(): void;
    checkUserIsLoggedInOnServer(apiResponse: any): void;
    user: UserResponseModel | undefined;
    removeUser(): void;
}

export const INITIAL_VALUES: AuthContextProps = {
    authenticated: false,
    lastStatusCode: { status: StatusCode.STATUS_INIT },
    login: () => {},
    registerState: RequestState.none,
    register: () => {},
    loginState: RequestState.none,
    logout: () => {},
    checkUserIsLoggedInOnServer: () => {},
    removeUser: () => {},
    user: { userId: -1 },
};

export const AuthContext = createContext<AuthContextProps>(INITIAL_VALUES);
