import { ReactNode, useEffect, useState } from "react";
import { AuthContext, INITIAL_VALUES } from "./AuthContext";
import useApi from "../hooks/useApi";
import { JSON_HEADERS } from "../utils/JSON_HEADERS";
import { RequestState } from "../utils/RequestState";
import {
    GET_USER_ENDPOINT,
    LOGIN_ENDPOINT,
    REGISTER_ENDPOINT,
} from "../endpoints";
import useLocalStorage from "../hooks/useLocalStorage";
import { addUnauthListener, removeUnauthListener } from "../utils/fetchApi";
import { Msg, StatusCode } from "../models/response";
import { UserResponseModel } from "../models/userResponseModel";

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

    const { state: loginState, handleFetch: fetchLogin } = useApi<any>();
    const { state: registerState, handleFetch: fetchRegister } = useApi<any>();
    const { state: logoutState, handleFetch: fetchLogout } = useApi<any>();
    const {
        state: userState,
        data: userData,
        handleFetch: fetchUser,
    } = useApi<UserResponseModel>();
    const [wss, setWs] = useState<WebSocket>();
    const [lastStatus, setLastStatus] = useState<Msg>();
    const [user, setUser] = useState<UserResponseModel>();

    console.log("Auth " + authenticated);

    useEffect(() => {
        // if (authenticated) return;
        fetchUser({ url: GET_USER_ENDPOINT });
        function handleUnauth() {
            setAuthenticated(false);
        }
        addUnauthListener(handleUnauth);

        return () => {
            removeUnauthListener(handleUnauth);
        };
    }, []);

    function openWS() {
        if (wss) return;
        console.log("location host " + location.host);
        console.log(`wss://${location.host}/websocket`);
        const ws = new WebSocket(`wss://${location.host}/websocket`);
        // ws.send("g");

        ws.addEventListener("open", (e) => {
            console.log("open ws");

            ws.send("hello from react");
        });

        ws.addEventListener("message", (event) => {
            try {
                console.log(event.data);
                const msg = JSON.parse(event.data) as Msg;
                setLastStatus(msg);
            } catch (error) {
                console.log(error);
            }
        });

        ws.addEventListener("close", () => {
            console.log("closing ws");
            setTimeout(openWS, 1000);
            ws.close();
            setWs(undefined);
        });

        setWs(ws);
    }

    useEffect(() => {
        // console.log(`login or user changed: ${RequestState[loginState]}`);
        if (loginState === RequestState.recieved) {
            setAuthenticated(true);
            openWS();
        }
    }, [loginState]);

    useEffect(() => {
        // console.log(`login or user changed: ${RequestState[userState]}`);
        if (userState === RequestState.recieved) {
            setAuthenticated(true);
            setUser(userData ?? undefined);
            openWS();
        } else if (userState === RequestState.failed) {
            setAuthenticated(false);
            setUser(undefined);
        }
    }, [userState]);

    useEffect(() => {
        if (loginState !== RequestState.none) setAuthenticated(false);
    }, [logoutState]);

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
            url: REGISTER_ENDPOINT,
            headers: JSON_HEADERS,
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
        });
        if (!registerState) return;
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
                lastStatusCode: lastStatus ?? { status: 0 },
                user: user,
                removeUser: () => {
                    setUser(undefined);
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
