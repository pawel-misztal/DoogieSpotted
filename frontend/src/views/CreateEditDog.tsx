import { RefObject, useContext, useRef, useState } from "react";
import { BackSvg } from "../assets/BackArrow";
import { PenSvg } from "../assets/PenSvg";
import MyButton from "../components/MyButton";
import MyInput from "../components/MyInput";
import MyTestArea from "../components/MyTextArea";
import { MyDogsContext } from "./MyDogsContext";
import { extendTailwindMerge, twMerge } from "tailwind-merge";
import { findAllInRenderedTree } from "react-dom/test-utils";
import { CameraSvg } from "../assets/CameraSvg";

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
    const maleDogRef = useRef<HTMLInputElement>(null);
    const femaleDogRef = useRef<HTMLInputElement>(null);
    const [img, setImg] = useState<string>("");
    const { backButtonClicked, mode } = useContext(MyDogsContext);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [bithdate, setBirthdate] = useState<string>("");
    const [isFemale, setIsFemale] = useState<boolean>(false);

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
        };
        takePicRef.current.addEventListener("change", onLoadImg);

        takePicRef.current.click();
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
            setImg(str);
        };
        browsePicRef.current.addEventListener("change", onLoadImg);

        browsePicRef.current.click();
    }

    function handleSendDog() {
        console.log("Sending dog");
        backButtonClicked();
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
                {/* <button
                    className="flex flex-row gap-2 items-center p-3 rounded-xl active:bg-slate-100 transition-all duration-200"
                    onClick={() => {
                        console.log("edit img");
                        console.log(takePicRef);
                        const s = pathFromFileInput(
                            takePicRef.current.files[0]
                        ) as string;
                        setImg(s);
                    }}
                >
                    <PenSvg className="fill-black" />
                    edytuj zdjęcie profilowe
                </button> */}
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
                    value={bithdate}
                    className="w-full"
                    labelClassName="text-black"
                    inputClassName="border-slate-400 bg-white w-full"
                    onChange={(e) => setBirthdate(e.target.value)}
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
                        />
                        <label htmlFor="samica">Samica</label>
                    </div>
                </div>

                <MyButton
                    text="Zapisz"
                    className="bg-zuzyRoz text-slate-900"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSendDog();
                    }}
                />
            </form>
        </>
    );
}
