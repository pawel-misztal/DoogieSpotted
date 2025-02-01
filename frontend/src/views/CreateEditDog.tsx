import { RefObject, useContext, useEffect, useRef, useState } from "react";
import { BackSvg } from "../assets/BackArrow";
import { PenSvg } from "../assets/PenSvg";
import MyButton from "../components/MyButton";
import MyInput from "../components/MyInput";
import MyTestArea from "../components/MyTextArea";
import { MyDogsContext, MyDogsMode } from "./MyDogsContext";
import { extendTailwindMerge, twMerge } from "tailwind-merge";
import { findAllInRenderedTree } from "react-dom/test-utils";
import { CameraSvg } from "../assets/CameraSvg";
import { fetchApi } from "../utils/fetchApi";
import { API_ADDR } from "../utils/address";
import { CreateDogModel } from "../models/dogModel";
import { LonLat } from "../models/types";
import { JSON_HEADERS } from "../utils/JSON_HEADERS";
import { dateToHtmlString, htmlToDateOrNull } from "../utils/dateUtils";

function pathAsFileFromFileInput(file: File | undefined): string | null {
    if (!file) return null;
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (ev) => {
        const str = fileReader.result;
        console.log(str);
    });
    fileReader.readAsDataURL(file);

    return null;
}

function pathFromFileInput(file: File | undefined): string {
    if (!file) return "";
    const str = URL.createObjectURL(file);
    console.log(str);
    return str;
}

export default function CreateEditDog() {
    const takePicRef = useRef<HTMLInputElement>(null);
    const browsePicRef = useRef<HTMLInputElement>(null);
    const [lastUsedPic, setLastUsedPic] = useState<"none" | "take" | "browse">(
        "none"
    );
    const maleDogRef = useRef<HTMLInputElement>(null);
    const femaleDogRef = useRef<HTMLInputElement>(null);
    const [img, setImg] = useState<string>("");
    const { backButtonClicked, mode, dogs, dogId, reloadDogs } =
        useContext(MyDogsContext);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [bithdate, setBirthdate] = useState<Date | null>(null);
    const [isFemale, setIsFemale] = useState<boolean>(false);
    const [lonlat, setLonlat] = useState<LonLat | null>(null);

    function handleTakePic() {
        if (takePicRef.current === null) return;

        const onLoadImg = () => {
            if (takePicRef.current === null) return;
            takePicRef.current.removeEventListener("change", onLoadImg);

            if (takePicRef.current.files?.length === 0) return;
            const f = takePicRef.current.files![0];
            console.log(f);
            const str = pathFromFileInput(f);
            setImg(str);
            setLastUsedPic("take");
        };
        takePicRef.current.addEventListener("change", onLoadImg);

        takePicRef.current.click();
    }

    useEffect(() => {
        if (mode !== MyDogsMode.edit) return;

        if (!dogs) {
            backButtonClicked();
            return;
        }

        const selectedDog = dogs.find((dogModel) => {
            return dogModel.id === dogId;
        });
        if (!selectedDog) return;

        setName(selectedDog.name);
        setDescription(selectedDog.description);
        setBirthdate(selectedDog.birthDate ?? null);
        setIsFemale(selectedDog.isFemale);

        async function loadDog() {
            const [res, dogImg] = await fetchApi<
                [
                    {
                        id: number;
                        dogId: number;
                    }
                ]
            >({
                url: `/api/dogs/${selectedDog!.id}/images`,
            });

            if (res === false || dogImg === null) return;

            const imgPath = `${API_ADDR}/api/dogs/${selectedDog!.id}/images/${
                dogImg[0].id
            }`;

            setImg(imgPath);
            setLastUsedPic("none");
        }
        loadDog();
    }, []);

    async function CreateDog() {
        const requestBody: CreateDogModel = {
            name: name,
            description: description,
            isFemale: isFemale,
            phoneNumber: "",
            birthDate: bithdate ?? undefined,
            raceId: 1,
            latitude: lonlat?.latitude ?? 0,
            longitude: lonlat?.longitude ?? 90,
        };

        const [succesfull, data] = await fetchApi<{ id: number }>({
            url: "/api/dogs",
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify(requestBody),
        });

        console.log("recieved");
        console.log(data);
        console.log(data?.id);

        if (succesfull) {
            await sendPic(data?.id);
            reloadDogs();
            backButtonClicked();
        }
    }

    async function UpdateDog() {
        if (!dogId) return;

        const requestBody: CreateDogModel = {
            name: name,
            description: description,
            isFemale: isFemale,
            birthDate: bithdate ?? undefined,
            phoneNumber: "",
            raceId: 1,
            latitude: lonlat?.latitude ?? 0,
            longitude: lonlat?.longitude ?? 90,
        };

        console.log(requestBody);

        const [succesfull] = await fetchApi<{ id: number }>({
            url: `/api/dogs/${dogId}`,
            method: "PUT",
            headers: JSON_HEADERS,
            body: JSON.stringify(requestBody),
            expectedOutput: "OK",
        });

        if (succesfull) {
            if (lastUsedPic !== "none") {
                await deleteAllPic(dogId);
                await sendPic(dogId);
            }
            reloadDogs();
            backButtonClicked();
        }
    }

    function getImg() {
        console.log(lastUsedPic);
        if (lastUsedPic === "none") return null;

        if (lastUsedPic === "browse") {
            console.log(takePicRef.current?.files);
            if (takePicRef.current === null) return null;
            if (takePicRef.current.files?.length === 0) return null;
            const f = takePicRef.current.files![0];
            console.log("browse");
            console.log(f);
            return f;
        }

        if (lastUsedPic === "take") {
            console.log(takePicRef.current?.files);
            if (browsePicRef.current === null) return null;
            if (browsePicRef.current.files?.length === 0) return null;
            const f = browsePicRef.current.files![0];
            console.log("take");
            console.log(f);
            return f;
        }

        return null;
    }

    async function getImgFromURL() {
        if (img === "") return null;
        return fetch(img).then((r) => r.blob());
    }

    async function deleteAllPic(dogId: number) {
        return fetchApi({
            url: `/api/dogs/${dogId}/images`,
            method: "DELETE",
            expectedOutput: "OK",
        });
    }

    async function sendPic(newDogId: number | undefined) {
        if (!newDogId) newDogId = dogId;
        if (!newDogId) return false;
        const img = await getImgFromURL();
        if (!img) return false;
        const formData = new FormData();
        formData.append("dogPhoto", img);
        const [success] = await fetchApi({
            url: `/api/dogs/${newDogId}/images`,
            method: "POST",
            body: formData,
        });
        return success;
    }

    function handleBrowsePic() {
        if (browsePicRef.current === null) return;

        const onLoadImg = () => {
            if (browsePicRef.current === null) return;
            browsePicRef.current.removeEventListener("change", onLoadImg);

            if (browsePicRef.current.files?.length === 0) return;
            const f = browsePicRef.current.files![0];
            console.log(f);
            const str = pathFromFileInput(f);
            console.log(browsePicRef.current.files![0]);
            setImg(str);
            setLastUsedPic("browse");
        };
        browsePicRef.current.addEventListener("change", onLoadImg);

        browsePicRef.current.click();
    }

    async function deleteDog() {
        if (!dogId) return;
        const [wasSuccesful] = await fetchApi({
            url: `/api/dogs/${dogId}`,
            method: "DELETE",
            expectedOutput: "OTHER",
        });

        if (wasSuccesful) {
            reloadDogs();
            backButtonClicked();
        }
    }

    function handleSendDog() {
        console.log("Sending dog");
        if (mode === MyDogsMode.create) CreateDog();
        if (mode === MyDogsMode.edit) UpdateDog();
        // backButtonClicked();
    }

    function handleLocalizeClick() {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLonlat({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                });
            },
            (e) => {
                console.log(e);
            }
        );
    }

    return (
        <>
            <button
                className="flex flex-row gap-6 justify-start items-center p-3 rounded-xl active:bg-slate-100 transition-all duration-200"
                onClick={() => {
                    console.log("Back");
                    backButtonClicked();
                }}
            >
                <BackSvg />
                <h1 className="text-pink-700">Moje pieski</h1>
            </button>

            <div className="flex flex-col items-center  w-full gap-5">
                <img
                    src={img === "" ? "/dogImagePlaceholder.png" : img}
                    className="rounded-2xl size-60 object-cover"
                ></img>
                <div className="flex flex-row gap-6">
                    <MyButton
                        text="zrób zdjęcie"
                        className="px-4 py-2 text-xs"
                        elementBefore={<CameraSvg />}
                        onClick={handleTakePic}
                    />
                    <MyButton
                        text="wybierz zdjęcie"
                        className="px-4 py-2 bg-slate-900 text-xs"
                        elementBefore={<PenSvg fill="white" />}
                        onClick={handleBrowsePic}
                    />
                </div>
                <div>
                    <label htmlFor="imageFile" style={{ display: "none" }}>
                        Upload a photo of yourself:
                    </label>
                    <input
                        type="file"
                        id="imageFile"
                        name="imageFile"
                        capture="user"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={takePicRef}
                    />
                    <label htmlFor="imageFile" style={{ display: "none" }}>
                        Upload a photo of yourself:
                    </label>
                    <input
                        type="file"
                        id="imageFile"
                        name="imageFile"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={browsePicRef}
                    />
                </div>
            </div>
            <form className="w-full flex flex-col gap-4">
                <MyInput
                    name="name"
                    label="Imie"
                    value={name}
                    // className="text-black"
                    labelClassName="text-black"
                    inputClassName="border-slate-400"
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
                <MyTestArea
                    name="description"
                    label="Opis"
                    labelClassName="text-black"
                    // className="resize-none"
                    inputClassName="border-slate-400 h-[7.5rem] resize-none text-sm"
                    placeholder="Napisz coś o swoim psiaku,
 aby inni mogli go lepiej poznać... "
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                    }}
                />
                <MyInput
                    name="birthDate"
                    label="Urodziny"
                    type="date"
                    value={dateToHtmlString(bithdate)}
                    className="w-full"
                    labelClassName="text-black"
                    inputClassName="border-slate-400 bg-white w-full"
                    onChange={(e) =>
                        setBirthdate(htmlToDateOrNull(e.target.value))
                    }
                />
                <div className="flex flex-row gap-8 items-center justify-center w-full">
                    <div
                        className="flex flex-row gap-4 items-center"
                        onClick={() => {
                            setIsFemale(false);
                            // maleDogRef.current?.click();
                        }}
                    >
                        <input
                            name="isFemale"
                            type="radio"
                            value="false"
                            checked={!isFemale}
                            ref={maleDogRef}
                            onChange={() => {}}
                        />
                        <label htmlFor="samiec">Samiec</label>
                    </div>
                    <div
                        className="flex flex-row gap-4 items-center"
                        onClick={() => {
                            setIsFemale(true);
                            // femaleDogRef.current?.click();
                        }}
                    >
                        <input
                            name="isFemale"
                            type="radio"
                            value="true"
                            checked={isFemale}
                            className=""
                            ref={femaleDogRef}
                            onChange={() => {}}
                        />
                        <label htmlFor="samica">Samica</label>
                    </div>
                </div>
                <p className="pb-0 mb-0">
                    {lonlat?.longitude} , {lonlat?.latitude}
                </p>
                <MyButton
                    className="bg-zuzyRoz text-slate-900"
                    text="Lokalizuj mnie"
                    onClick={(e) => {
                        e.preventDefault();
                        handleLocalizeClick();
                    }}
                ></MyButton>
                <MyButton
                    text={mode === MyDogsMode.create ? "Dodaj" : "Zapisz"}
                    className="bg-zuzyRoz text-slate-900"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSendDog();
                    }}
                />

                {mode === MyDogsMode.edit && (
                    <MyButton
                        text="Usuń mnie"
                        className="bg-red-600 text-white p-2 mt-12"
                        onClick={deleteDog}
                    />
                )}
            </form>
        </>
    );
}
