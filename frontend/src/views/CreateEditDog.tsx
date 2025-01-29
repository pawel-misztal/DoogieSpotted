import { RefObject, useRef, useState } from "react";
import { BackSvg } from "../assets/BackArrow";
import { PenSvg } from "../assets/PenSvg";
import MyButton from "../components/MyButton";
import MyInput from "../components/MyInput";
import MyTestArea from "../components/MyTextArea";

function pathFromFileInput(file: File | undefined): string | null {
    if (!file) return null;
    const fileReader = new FileReader();
    fileReader.addEventListener("load", (ev) => {
        const str = fileReader.result;
        console.log(str);
    });
    fileReader.readAsDataURL(file);

    return null;
}

function pathFromFileInput2(file: File | undefined): string | null {
    if (!file) return null;
    // const fileReader = new FileReader();
    // fileReader.addEventListener("load", (ev) => {
    //     const str = fileReader.result;
    //     console.log(str);
    // });
    // fileReader.readAsDataURL(file);

    const str = URL.createObjectURL(file);
    console.log(str);
    return str;
}

export default function CreateEditDog() {
    const ref = useRef<HTMLInputElement>(null);
    const [img, setImg] = useState<string>("");

    return (
        <>
            <button
                className="flex flex-row gap-6 justify-start items-center p-3 rounded-xl active:bg-slate-100 transition-all duration-200"
                onClick={() => console.log("Back")}
            >
                <BackSvg />
                <h1 className="text-pink-700">Moje pieski</h1>
            </button>

            <div className="flex flex-col items-center  w-full gap-5">
                <img
                    src={img === "" ? "/dogImagePlaceholder.png" : img}
                    className="rounded-[6rem] size-64 object-cover"
                ></img>
                <button
                    className="flex flex-row gap-2 items-center p-3 rounded-xl active:bg-slate-100 transition-all duration-200"
                    onClick={() => {
                        console.log("edit img");
                        console.log(ref);
                        const s = pathFromFileInput2(
                            ref.current.files[0]
                        ) as string;
                        setImg(s);
                    }}
                >
                    <PenSvg className="fill-black" />
                    edytuj zdjęcie profilowe
                </button>
                <p>
                    <label htmlFor="imageFile">
                        Upload a photo of yourself:
                    </label>
                    <input
                        type="file"
                        id="imageFile"
                        capture="user"
                        accept="image/*"
                        ref={ref}
                    />
                </p>
            </div>
            <form className="w-full flex flex-col gap-4">
                <MyInput
                    name="name"
                    label="Imie"
                    value="sad"
                    // className="text-black"
                    labelClassName="text-black"
                    inputClassName="border-slate-400"
                    onChange={() => {}}
                />
                <MyTestArea
                    name="description"
                    label="Opis"
                    labelClassName="text-black"
                    // className="resize-none"
                    inputClassName="border-slate-400 h-[7.5rem] resize-none text-sm"
                    placeholder="Napisz coś o swoim psiaku,
 aby inni mogli go lepiej poznać... "
                    value="sdads"
                    onChange={() => {}}
                />
                <div className="flex flex-row gap-8 items-center justify-center w-full">
                    <div className="flex flex-row gap-4 items-center">
                        <input
                            name="isFemale"
                            type="radio"
                            checked
                            value="false"
                        />
                        <label htmlFor="samiec">Samiec</label>
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <input
                            name="isFemale"
                            type="radio"
                            value="true"
                            className=""
                        />
                        <label htmlFor="samica">Samica</label>
                    </div>
                </div>

                <MyButton text="Zapisz" className="bg-pink-500" />
            </form>
        </>
    );
}
