import { useContext, useEffect, useState } from "react";
import { DogIconSvg } from "../assets/DogIconSvg";
import { HeartNotificationSvg } from "../assets/HeartsNotificationSvg";
import { HeartsSvg } from "../assets/HeartsSvg";
import { HomeSvg } from "../assets/HomeSvg";
import { MessageSvg } from "../assets/MessageSvg";
import { PersonSvg } from "../assets/PersonSvg";
import MyButton from "./MyButton";
import useLocalStorage from "../hooks/useLocalStorage";
import { NavContext, NavState } from "../providers/NavContext";
import { useNavigate } from "react-router-dom";

const BLACK = "black";
const PINK = "#9d174d";
type states = "HOME" | "PROFILE" | "MATCHES" | "MYDOGS";
export default function Navbar() {
    const { state: selected, setState: setSelected } = useContext(NavContext);
    const [hasNotification, setHasNotification] = useState<boolean>(false);

    const nav = useNavigate();

    useEffect(() => {
        switch (selected) {
            case NavState.home:
                nav("/");
                break;

            case NavState.profile:
                nav("/profile");
                break;
            case NavState.matches:
                nav("/matches");
                break;
            case NavState.myDogs:
                nav("/mydogs");
                break;

            default:
                nav("");
                break;
        }
    }, [selected]);

    const boolToCol = (state: NavState) => (selected === state ? PINK : BLACK);
    const homeSelectedCol = boolToCol(NavState.home);
    const profileSelectedCol = boolToCol(NavState.profile);
    const matchesSeletedCol = boolToCol(NavState.matches);
    const mydogsSelectedCol = boolToCol(NavState.myDogs);

    //border-t-2 border-slate-400
    return (
        <div className=" bg-white fixed left-0 right-0 h-14 m-0 bottom-0 z-10  overscroll-none flex justify-center shadow-navBar">
            <div className=" w-[24.375rem] h-full flex flex-row justify-around">
                <button
                    className="flex flex-row justify-center items-center flex-grow"
                    aria-label="Home"
                    onClick={() => setSelected(NavState.home)}
                >
                    <HomeSvg
                        className="size-6  active:invert-[0.4] transition-all duration-300"
                        fill={homeSelectedCol}
                    />
                </button>
                <button
                    className="flex flex-row justify-center items-center flex-grow"
                    aria-label="Profile"
                    onClick={() => setSelected(NavState.profile)}
                >
                    <PersonSvg
                        className="size-6  active:invert-[0.4] transition-all duration-300"
                        fill={profileSelectedCol}
                    />
                </button>

                <button
                    className="flex flex-row justify-center items-center flex-grow"
                    aria-label="Matches"
                    onClick={() => setSelected(NavState.matches)}
                >
                    <HeartNotificationSvg
                        svgProps={{
                            className:
                                "size-6 fill-black active:invert-[0.4] transition-all duration-300",
                        }}
                        propsHeart={{ fill: matchesSeletedCol }}
                        propsCircle={{
                            fill: hasNotification ? "#BE185D" : "transparent",
                        }}
                    />
                </button>
                <button
                    className="flex flex-row justify-center items-center flex-grow transition-all duration-300"
                    aria-label="My dogs"
                    onClick={() => setSelected(NavState.myDogs)}
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
