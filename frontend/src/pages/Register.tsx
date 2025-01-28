import { ChangeEvent, useContext, useEffect, useState } from "react";
// import { DogLoveIconSvg } from "../assets/DogLoveIconSvg";
import MyButton from "../components/MyButton";
import MyInput from "../components/MyInput";
import { DogHeadSvg } from "../assets/DogHeadSvg";
import { AuthContext } from "../providers/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [email, SetUsername] = useState("");
    const [password, SetPassword] = useState("");
    const navigate = useNavigate();

    const { authenticated, register } = useContext(AuthContext);

    const handleUsernameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        SetUsername(e.target.value);
    };

    const handlePasswordChanged = (e: ChangeEvent<HTMLInputElement>) => {
        SetPassword(e.target.value);
    };

    const handleRegisterClicked = () => {
        register(email, password);
    };

    useEffect(() => {
        if (authenticated) {
            navigate("/");
        }
    }, [authenticated]);

    return (
        <div className="w-full  flex flex-col items-center px-5 pt-14 pb-6 gap-12">
            <form
                action="/api/register"
                method="post"
                className="w-full flex flex-col items-center gap-6"
                onSubmit={(e) => e.preventDefault()}
            >
                <DogHeadSvg />
                <h1 className="text-lg font-bold text-slate-700">
                    Rejestracja
                </h1>
                <div className="w-full flex flex-col items-center gap-4">
                    <MyInput
                        name="username"
                        value={email}
                        label="Email"
                        className="w-full"
                        type="username"
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
                </div>
                <div className="w-full flex flex-col items-center gap-9 px-8">
                    <MyButton
                        text="Zaloguj sie"
                        className="w-full"
                        onClick={handleRegisterClicked}
                    />
                    <div className="flex flex-row gap-1 text-sm font-monrope">
                        Masz już konto?
                        <Link
                            to="/login"
                            className="text-pink-800 font-semibold active:text-pink-500"
                            draggable="false"
                        >
                            Zaloguj się
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
