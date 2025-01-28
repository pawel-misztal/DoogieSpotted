import { useState } from "react";
import { DogIconSvg } from "../assets/DogIconSvg";
import { HeartNotificationSvg } from "../assets/HeartsNotificationSvg";
import { HeartsSvg } from "../assets/HeartsSvg";
import { HomeSvg } from "../assets/HomeSvg";
import { MessageSvg } from "../assets/MessageSvg";
import { PersonSvg } from "../assets/PersonSvg";
import MyButton from "./MyButton";
import useLocalStorage from "../hooks/useLocalStorage";

const BLACK = "black";
const PINK = "#9d174d";
type states = "HOME" | "PROFILE" | "MATCHES" | "MYDOGS";
export default function Navbar() {
    const [selected, setSelected] = useLocalStorage<states>(
        "nav-bar-state",
        "HOME"
    );
    const [hasNotification, setHasNotification] = useState<boolean>(false);

    const boolToCol = (state: states) => (selected === state ? PINK : BLACK);
    const homeSelectedCol = boolToCol("HOME");
    const profileSelectedCol = boolToCol("PROFILE");
    const matchesSeletedCol = boolToCol("MATCHES");
    const mydogsSelectedCol = boolToCol("MYDOGS");

    return (
        <div className=" bg-white fixed left-0 right-0 h-14 m-0 bottom-0 z-10 border-t-2 border-slate-400 overscroll-none flex justify-center">
            <div className=" w-[24.375rem] h-full flex flex-row justify-around">
                <button
                    className="flex flex-row justify-center items-center flex-grow"
                    aria-label="Home"
                    onClick={() => setSelected("HOME")}
                >
                    <HomeSvg
                        className="size-6  active:invert-[0.4]"
                        fill={homeSelectedCol}
                    />
                </button>
                <button
                    className="flex flex-row justify-center items-center flex-grow"
                    aria-label="Profile"
                    onClick={() => setSelected("PROFILE")}
                >
                    <PersonSvg
                        className="size-6  active:invert-[0.4]"
                        fill={profileSelectedCol}
                    />
                </button>

                <button
                    className="flex flex-row justify-center items-center flex-grow"
                    aria-label="Matches"
                    onClick={() => setSelected("MATCHES")}
                >
                    <HeartNotificationSvg
                        svgProps={{
                            className: "size-6 fill-black active:invert-[0.4]",
                        }}
                        propsHeart={{ fill: matchesSeletedCol }}
                        propsCircle={{
                            fill: hasNotification ? "#BE185D" : "transparent",
                        }}
                    />
                </button>
                <button
                    className="flex flex-row justify-center items-center flex-grow"
                    aria-label="My dogs"
                    onClick={() => setSelected("MYDOGS")}
                >
                    <DogIconSvg
                        className="size-6  active:invert-[0.4]"
                        fill={mydogsSelectedCol}
                    />
                </button>
            </div>
        </div>
    );
}
