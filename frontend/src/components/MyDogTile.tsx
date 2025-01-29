import { HeartSvg } from "../assets/HeartSvg";
import { HomeSvg } from "../assets/HomeSvg";
import { PenSvg } from "../assets/PenSvg";
import { PhoneSvg } from "../assets/PhoneSvg";
import MyButton from "./MyButton";

interface MyDogTileProps {
    dogName: string;
    matchCount: number;
    phone: string;
    location: string;
    imgPath: string;
    onEditClicked?: (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
}

export default function MyDogTile({
    dogName,
    matchCount,
    phone,
    location,
    imgPath,
    onEditClicked,
}: MyDogTileProps) {
    return (
        <div className=" shadow-dogTile rounded-2xl flex gap-4 overflow-hidden w-full min-h-[10.625rem]">
            <img
                src={imgPath}
                className="object-cover h-[10.625rem] w-[6.25rem] flex-shrink-0"
                alt="dog photo"
                crossOrigin="use-credentials"
            ></img>
            <div className="w-full relative">
                {" "}
                {/* w-[17.3125rem]*/}
                <div className="flex flex-col text-black text-base font-monrope font-semibold items-start py-4 gap-2 ">
                    <p>{dogName}</p>
                    <div className="flex flex-row items-start justify-center gap-4 text-xs">
                        <HeartSvg
                            className="size-3 fill-pink-300 self-center"
                            fill="#831843"
                            height={12}
                        />
                        <p className="font-monrope font-normal text-slate-600">
                            {matchCount} macze
                        </p>
                    </div>

                    {/* <div className="flex flex-row items-start justify-center gap-4 text-xs">
                        <PhoneSvg
                            className="fill-slate-600 self-center size-3"
                            fill="#831843"
                        />
                        <p className="font-monrope font-normal text-pink-600">
                            {phone}
                        </p>
                    </div> */}
                    <div className="flex flex-row items-start justify-center gap-4 text-xs">
                        <HomeSvg
                            className="fill-slate-600 self-center size-3"
                            fill="#831843"
                            height={12}
                        />
                        <p className="font-monrope font-normal text-slate-600">
                            Mieszka w:{" "}
                            <span className="text-black">{location}</span>
                        </p>
                    </div>
                </div>
                <MyButton
                    text="edytuj"
                    className="right-4 bottom-4 absolute text-xs bg-slate-900 px-4 py-2 active:bg-slate-700"
                    elementBefore={<PenSvg className="size-3 fill-white" />}
                    onClick={onEditClicked}
                />
            </div>
        </div>
    );
}
