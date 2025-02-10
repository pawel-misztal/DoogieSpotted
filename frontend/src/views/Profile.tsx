import { useContext, useState } from "react";
import MyButton from "../components/MyButton";
import { AuthContext } from "../providers/AuthContext";
import MyInput from "../components/MyInput";
import { twMerge } from "tailwind-merge";
import LoadingAnim from "../components/LoadingAnim";
import { fetchApi } from "../utils/fetchApi";
import { POST_RESET_PASSWORD } from "../utils/address";
import { JSON_HEADERS } from "../utils/JSON_HEADERS";

export default function Profile() {
    const { logout } = useContext(AuthContext);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [sendReset, setSendReset] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleResetPassword() {
        setSuccess("");
        if (oldPassword === "") {
            setError("Wypełnij pole z hasłem");
            return;
        }

        if (newPassword !== repeatPassword) {
            setError("Nowe hasła muszą być takie same");
            return;
        }

        if (newPassword === "") {
            return setError("Wypełnij pole z nowym hasłem");
        }
        setError("");
        setSendReset(true);
        const [ok] = await fetchApi({
            url: POST_RESET_PASSWORD,
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({
                password: oldPassword,
                newPassword: newPassword,
            }),
            expectedOutput: "OK",
        });

        setSendReset(false);
        if (!ok) {
            setError("Stare hasło jest nie poprawne");
        } else {
            setSuccess("Udało się zresetowac hasło");
        }
    }

    function handleType() {}

    return (
        <div className="flex flex-col w-full items-start gap-12">
            <h1 className="text-pink-700">Profil mojego Pana/Pani</h1>

            <form
                className=" w-full flex flex-col gap-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleResetPassword();
                    console.log("reset password");
                }}
            >
                <div className="flex flex-col w-full">
                    <MyInput
                        name="oldPassword"
                        label="Stare hasło"
                        labelClassName="text-black"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <MyInput
                        name="newPassword"
                        label="Nowe hasło"
                        labelClassName="text-black"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <MyInput
                        name="repeatNewPassword"
                        label="Powtórz nowe hasło"
                        labelClassName="text-black"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                </div>
                <div
                    className={twMerge(
                        error ? "text-red-700" : "text-green-600",
                        error || success ? "opacity-100" : "opacity-0"
                    )}
                >
                    {error === "" ? (success === "" ? "s" : success) : error}
                </div>
                <MyButton
                    text="Resetuj hasło"
                    disabled={sendReset}
                    elementBefore={
                        sendReset ? (
                            <LoadingAnim
                                className="w-4"
                                containerClassName="max-h-4 min-h-4 w-fit"
                            />
                        ) : (
                            <></>
                        )
                    }
                    className="w-full"
                />
            </form>

            <MyButton
                text="wyloguj"
                className="bg-slate-500"
                onClick={logout}
            />
        </div>
    );
}
