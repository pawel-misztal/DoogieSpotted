import {
    ChangeEvent,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { DogLoveIconSvg } from "../assets/DogLoveIconSvg";
import MyButton from "../components/MyButton";
import MyInput from "../components/MyInput";
import { AuthContext } from "../providers/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { RequestState } from "../utils/RequestState";

export default function Login() {
    const [email, SetUsername] = useState("");
    const [password, SetPassword] = useState("");
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const { authenticated, login, loginState } = useContext(AuthContext);

    const handleUsernameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        SetUsername(e.target.value);
    };

    const handlePasswordChanged = (e: ChangeEvent<HTMLInputElement>) => {
        SetPassword(e.target.value);
    };

    const handleLoginClicked = () => {
        login(email, password);
    };

    useEffect(() => {
        if (authenticated) {
            navigate("/");
        }
    }, [authenticated]);

    useEffect(() => {
        if (loginState === RequestState.failed) {
            setErr("Zły login lub hasło");
        } else {
            setErr("");
        }
    }, [loginState]);

    return (
        <div className="w-full  flex flex-col items-center px-5 pt-14 pb-6 gap-12">
            <form
                action="/api/login"
                method="post"
                className="w-full flex flex-col items-center gap-6"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="w-full flex flex-col items-center gap-4">
                    <MyInput
                        name="username"
                        value={email}
                        label="Email"
                        className="w-full"
                        type="email"
                        onChange={handleUsernameChanged}
                    />
                    <MyInput
                        name="password"
                        value={password}
                        label="Hasło"
                        className="w-full"
                        type="password"
                        onChange={handlePasswordChanged}
                    />
                    <div className="text-red-700 text-lg">{err}</div>
                </div>
                <div className="w-full flex flex-col items-center gap-9 px-8">
                    <MyButton
                        text="Zaloguj sie"
                        className="w-full"
                        onClick={handleLoginClicked}
                    />
                    <div className="flex flex-row gap-1 text-sm font-monrope">
                        Nie masz konta?
                        <Link
                            to="/register"
                            className="text-pink-800 font-semibold active:text-pink-500 "
                            draggable="false"
                        >
                            Zarejestruj się
                        </Link>
                    </div>
                </div>
            </form>
            <DogLoveIconSvg />
        </div>
    );
}
