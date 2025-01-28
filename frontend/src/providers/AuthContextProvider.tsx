import { ReactNode, useEffect, useState } from "react";
import { AuthContext, INITIAL_VALUES } from "./AuthContext";
import useApi, { JSON_HEADERS } from "../hooks/useApi";
import { GET_USER_ENDPOINT, LOGIN_ENDPOINT } from "../endpoints";
import useLocalStorage from "../hooks/useLocalStorage";

interface AuthContextProviderProps {
    children?: ReactNode;
}

export default function AuthContextProvider({
    children,
}: AuthContextProviderProps) {
    const [authenticated, setAuthenticated] = useLocalStorage(
        "was-logged",
        INITIAL_VALUES.authenticated
    );

    const { isOk: loginIsOk, handleFetch: fetchLogin } = useApi<any>();
    const { isOk: registerIsOk, handleFetch: fetchRegister } = useApi<any>();
    const { isOk: logoutIsOk, handleFetch: fetchLogout } = useApi<any>();
    const { isOk: userOk, handleFetch: fetchUser } = useApi<any>();

    console.log("Auth " + authenticated);

    useEffect(() => {
        if (authenticated) return;
        fetchUser({ url: GET_USER_ENDPOINT });
    }, []);

    useEffect(() => {
        if (loginIsOk || userOk) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
        console.log(loginIsOk);
    }, [loginIsOk, userOk]);

    useEffect(() => {
        setAuthenticated(false);
    }, [logoutIsOk]);

    // useEffect(() => {
    //     if(registerIsOk) {
    //         if(authenticated)
    //             return;

    //     }
    // }, [registerIsOk])

    function login(email: string, password: string) {
        fetchLogin({
            url: LOGIN_ENDPOINT,
            headers: JSON_HEADERS,
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
        });
    }

    async function register(email: string, password: string) {
        await fetchRegister({
            url: LOGIN_ENDPOINT,
            headers: JSON_HEADERS,
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
        });
        if (!registerIsOk) return;
        login(email, password);
    }

    function logout() {
        fetchLogout({
            url: LOGIN_ENDPOINT,
        });
    }

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                login,
                register,
                logout,
                checkUserIsLoggedInOnServer: () => {},
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
