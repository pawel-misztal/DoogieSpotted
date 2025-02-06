import { twJoin, twMerge } from "tailwind-merge";
import { FemaleIconSvg } from "../assets/FemaleIconSvg";
import { MaleIconSvg } from "../assets/MaleIconSvg";
import { customTwMerge } from "../utils/customTwMerge";

interface MatchTileProps {
    imgPath: string;
    dogName: string;
    yearsOld: number;
    distanceKm: number;
    description: string;
    isFemale: boolean;

    className?: string;
}

export default function MatchTile({
    imgPath,
    dogName,
    yearsOld,
    distanceKm,
    description,
    isFemale,
    className = "",
}: MatchTileProps) {
    return (
        <div
            className={customTwMerge(
                "relative flex flex-col shadow-dogTile rounded-[2rem] overflow-hidden w-full shrink-0",
                className
            )}
        >
            <div className="absolute size-6 left-4 top-4 bg-white rounded-full flex items-center justify-center">
                {isFemale ? (
                    <FemaleIconSvg className="size-4" />
                ) : (
                    <MaleIconSvg className="size-3" />
                )}
            </div>
            <img
                src={imgPath}
                className="h-[21.25rem] object-cover"
                alt="dog photo"
                crossOrigin="use-credentials"
                referrerPolicy="strict-origin-when-cross-origin"
            ></img>
            <div className="px-7 py-4 gap-3 flex flex-col">
                <h1 className="font-monrope text-lg font-semibold text-black">
                    {dogName}
                </h1>
                <h2 className="font-monrope text-base font-semibold text-slate-600 text-center">
                    {yearsOld} lata
                </h2>
                <div className="flex flex-row gap-3">
                    <p className="font-monrope text-base font-semibold text-pink-700">
                        {Math.round(distanceKm)} km od ciebie
                    </p>
                </div>
                <p className="font-monrope text-xs font-normal text-slate-700 text-start ">
                    {description}
                </p>
            </div>
        </div>
    );
}
