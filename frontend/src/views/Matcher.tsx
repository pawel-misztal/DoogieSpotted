import { useContext, useEffect, useRef, useState } from "react";
import { BtnXSvg } from "../assets/BtnXSvg";
import { HeartSvg } from "../assets/HeartSvg";
import MatchTile from "../components/MatchTile";
import { twMerge } from "tailwind-merge";
import { useButtonScale } from "../hooks/useButtonScale";
import LoadingAnim from "../components/LoadingAnim";
import { fetchApi } from "../utils/fetchApi";
import { NavContext } from "../providers/NavContext";
import { DailyMatchModel } from "../models/matchModel";
import {
    DEFAULT_IMG_PATH,
    GET_DAILY_MATCHES_ADDR,
    GET_DOG_ADDR,
    GET_DOG_IMAGES_ADDR,
    GET_DOG_IMG_PATH_ADDR,
} from "../utils/address";
import { dogModel } from "../models/dogModel";
import { dogImage } from "../models/dogPhotos";
import { calculateAge } from "../utils/date";
import { htmlToDateOrNull } from "../utils/dateUtils";
import { Vector3 } from "../utils/vector3";
import {
    EARTH_RADIUS_KM,
    GetDistanceBetweenTwoPlaces,
} from "../utils/radialDistanceCalculator";

function getOtherDogId(dailyMatch: DailyMatchModel, dogId: number) {
    return dailyMatch.lowerDogId === dogId
        ? dailyMatch.higherDogId
        : dailyMatch.lowerDogId;
}

export default function Matcher() {
    // const [act, setAct] = useState<number>(0);
    // const ref = useRef<SVGSVGElement>(null);
    // const btnRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const { selectedDogId } = useContext(NavContext);
    const [name, setName] = useState("");
    const [isFemale, setIsFemale] = useState(false);
    const [age, setAge] = useState(0);
    const [description, setDescription] = useState("");
    const [imgPath, setImgPath] = useState(DEFAULT_IMG_PATH);
    const [distance, setDistance] = useState(0);
    const [matchDogs, setMatchDogs] = useState<dogModel[]>();

    const { ref: leftScaleRef, btnRef: leftButton } = useButtonScale(
        1,
        100,
        () => setLoading(false),
        () => console.log("reached"),
        () => console.log("unreached")
    );

    const { ref: rightScaleRef, btnRef: rightButton } = useButtonScale(
        1,
        100,
        () => setLoading(true),
        () => console.log("reached"),
        () => console.log("unreached")
    );

    useEffect(() => {
        async function LoadDailyMatches() {
            if (selectedDogId === -1) return;
            const [success, data] = await fetchApi<DailyMatchModel[]>({
                url: GET_DAILY_MATCHES_ADDR(selectedDogId),
            });
            if (!data) return;
            setLoading(true);

            const dailyMatchDogsUnfiltered = await Promise.all(
                data.map(async (dailyMatch) => {
                    const otherDogId = getOtherDogId(dailyMatch, selectedDogId);
                    const [otherDogOk, otherDog] = await fetchApi<dogModel>({
                        url: GET_DOG_ADDR(otherDogId),
                    });

                    if (!otherDogOk || otherDog === null) return;

                    const [dogImgOk, dogImg] = await fetchApi<dogImage[]>({
                        url: GET_DOG_IMAGES_ADDR(otherDogId),
                    });

                    const imgPath =
                        dogImg && dogImg.length > 0
                            ? GET_DOG_IMG_PATH_ADDR(otherDogId, dogImg[0].id)
                            : DEFAULT_IMG_PATH;
                    otherDog.imgPath = imgPath;
                    return otherDog;
                })
            );
            const dailyMatchDogs = dailyMatchDogsUnfiltered.filter(
                (d) => d !== undefined
            );
            console.log(dailyMatchDogs);
            setMatchDogs(dailyMatchDogs);
            setLoading(false);
        }
        LoadDailyMatches();
    }, []);

    useEffect(() => {
        async function LoadDog() {
            if (!matchDogs) return;
            if (matchDogs.length == 0) return;

            const dog = matchDogs[0];

            setLoading(true);
            const [myDogOk, myDog] = await fetchApi<dogModel>({
                url: GET_DOG_ADDR(selectedDogId),
            });

            setLoading(false);
            if (!myDogOk || !myDog) {
                return;
            }

            setName(dog.name);
            setAge(calculateAge(dog.birthDate?.toString()));
            setDescription(dog.description);
            setImgPath(dog.imgPath);
            setIsFemale(dog.isFemale);
            const myDogPos = new Vector3(myDog.x, myDog.y, myDog.z);
            const otherDogPos = new Vector3(dog.x, dog.y, dog.z);

            console.log("dogs");

            console.log(myDogPos);

            console.log(otherDogPos);
            console.log(GetDistanceBetweenTwoPlaces(myDogPos, otherDogPos));
            setDistance(GetDistanceBetweenTwoPlaces(myDogPos, otherDogPos));
        }
        LoadDog();
    }, [matchDogs]);

    const [cancelTouched, setCancelTouched] = useState(false);
    return (
        <div
            className="flex flex-row gap-4 h-full justify-center items-center my-auto min-h-[530px] w-full
        "
        >
            <div className="min-h-8 min-w-8 relative">
                <div
                    className={twMerge(
                        "absolute  pr-32 py-32 z-[1] -translate-y-32"
                    )}
                    ref={leftButton}
                >
                    <BtnXSvg height={32} width={32} ref={leftScaleRef} />
                </div>
            </div>
            {!loading ? (
                <MatchTile
                    className="shrink"
                    dogName={name}
                    isFemale={isFemale}
                    yearsOld={age}
                    distanceKm={distance}
                    imgPath={imgPath}
                    description={description}
                />
            ) : (
                <div className="relative flex flex-col justify-center shadow-dogTile rounded-[2rem] bg-slate-100 overflow-hidden w-full shrink h-[530px]">
                    <div className="flex flex-row justify-center items-baseline">
                        <LoadingAnim className="size-20" />
                    </div>
                </div>
            )}
            <div className="min-h-8 min-w-8  relative">
                <div
                    className={twMerge(
                        "absolute pl-32 py-32 pr-6 -translate-x-32 -translate-y-32 z-[2]"
                    )}
                    ref={rightButton}
                >
                    <HeartSvg
                        height={32}
                        width={32}
                        ref={rightScaleRef}
                        fill="#DB2777"
                    />
                </div>
            </div>
        </div>
    );
}
