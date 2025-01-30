import { useEffect, useState } from "react";
import MyDogTile from "../components/MyDogTile";
import { dogModel, myDogs } from "../models/dogModel";
import { fetchApi } from "../utils/fetchApi";
import { API_ADDR } from "../utils/address";
import MyButton from "../components/MyButton";
import { PawIconSvg } from "../assets/PawIconSvg";
import CreateEditDog from "./CreateEditDog";
import { MyDogsMode, MyDogsContext } from "./MyDogsContext";
import useLocalStorage from "../hooks/useLocalStorage";

export default function MyDogs() {
    const [dogs, setDogs] = useState<[dogModel]>();
    const [dogId, setDogId] = useState<number | undefined>();
    const [mode, setMode] = useLocalStorage<MyDogsMode>(
        "mydogs-mode",
        MyDogsMode.create
    );

    async function loadDogs() {
        const [dogsStatus, dogData] = await fetchApi<[dogModel]>({
            url: "/api/dogs",
        });
        if (dogsStatus === false || dogData === null) {
            setDogs(undefined);
            return;
        }

        console.log(dogData);
        const promises = dogData.map(async (dd, i) => {
            const [res, dogImg] = await fetchApi<
                [
                    {
                        id: number;
                        dogId: number;
                    }
                ]
            >({
                url: `/api/dogs/${dd.id}/images`,
            });

            if (res === false || dogImg === null) return;

            const imgPath = `${API_ADDR}/api/dogs/${dd.id}/images/${dogImg[0].id}`;

            dogData[i].imgPath = imgPath;
        });

        await Promise.all(promises);

        setDogs(dogData);
    }

    useEffect(() => {
        loadDogs();
    }, []);

    function handleBackButtonClicked() {
        setDogId(undefined);
        setMode(MyDogsMode.list);
    }

    return (
        <>
            <MyDogsContext.Provider
                value={{
                    dogId: dogId,
                    dogs: dogs,
                    mode: mode,
                    backButtonClicked: handleBackButtonClicked,
                }}
            >
                {mode === MyDogsMode.create && <CreateEditDog />}
                {mode === MyDogsMode.edit && <CreateEditDog />}
                {mode === MyDogsMode.list && (
                    <>
                        {" "}
                        <h1 className="text-pink-700">Moje pieski</h1>
                        <MyButton text="ref" onClick={loadDogs} />
                        {dogs &&
                            dogs!.map((dogModel) => {
                                return (
                                    <MyDogTile
                                        key={dogModel.id}
                                        dogName={dogModel.name}
                                        location={`${dogModel.longitude} ${dogModel.latitude}`}
                                        matchCount={0}
                                        imgPath={
                                            dogModel.imgPath ??
                                            "/dogImagePlaceholder.png"
                                        }
                                        phone="none"
                                        onEditClicked={() => {
                                            console.log(
                                                `start editing dog with id:${dogModel.id}`
                                            );
                                            setMode(MyDogsMode.edit);
                                            setDogId(dogModel.id);
                                        }}
                                    />
                                );
                            })}
                        <MyButton
                            text="Dodaj nowy profil"
                            className="self-center text-base text-gray-950 bg-zuzyRoz active:bg-pink-500 font-monrope rounded-2xl mt-7"
                            elementAfter={
                                <PawIconSvg className="size-6 fill-black" />
                            }
                            onClick={() => {
                                console.log("add new dog");
                                setMode(MyDogsMode.create);
                            }}
                        ></MyButton>
                    </>
                )}

                <div className="min-h-20"></div>
            </MyDogsContext.Provider>
        </>
    );
}
