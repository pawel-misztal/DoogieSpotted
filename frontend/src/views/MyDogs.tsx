import { useContext, useEffect, useState } from "react";
import MyDogTile from "../components/MyDogTile";
import { dogModel, myDogs } from "../models/dogModel";
import { fetchApi } from "../utils/fetchApi";
import {
    API_ADDR,
    GET_DOG_IMAGES_ADDR,
    GET_DOG_IMG_PATH_ADDR,
    GET_DOGS_ADDR,
} from "../utils/address";
import MyButton from "../components/MyButton";
import { PawIconSvg } from "../assets/PawIconSvg";
import CreateEditDog from "./CreateEditDog";
import { MyDogsMode, MyDogsContext } from "./MyDogsContext";
import useLocalStorage from "../hooks/useLocalStorage";
import {
    DefaultBackgroundContext,
    DefaultBackgroundContextProps,
} from "../providers/DefaultBaackgroundContext";
import { NavContext } from "../providers/NavContext";
import { LoadingSvg } from "../assets/LoadingAnim";
import LoadingAnim from "../components/LoadingAnim";

export default function MyDogs() {
    const [dogs, setDogs] = useState<[dogModel]>();
    const [dogId, setDogId] = useState<number | undefined>();
    const [mode, setMode] = useLocalStorage<MyDogsMode>(
        "mydogs-mode",
        MyDogsMode.list
    );
    const { scrollToTop } = useContext(DefaultBackgroundContext);
    const { selectedDogId, setSelectedDogId } = useContext(NavContext);
    const [loading, setLoading] = useState(false);

    async function loadDogs() {
        setLoading(true);
        const [dogsStatus, dogData] = await fetchApi<[dogModel]>({
            url: GET_DOGS_ADDR,
        });
        if (dogsStatus === false || dogData === null) {
            setDogs(undefined);
            setLoading(false);
            return;
        }

        const promises = dogData.map(async (dd, i) => {
            const [res, dogImg] = await fetchApi<
                [
                    {
                        id: number;
                        dogId: number;
                    }
                ]
            >({
                url: GET_DOG_IMAGES_ADDR(dd.id),
            });

            if (res === false || dogImg === null) return;

            const imgPath = GET_DOG_IMG_PATH_ADDR(dd.id, dogImg[0].id);

            dogData[i].imgPath = imgPath;
        });

        await Promise.all(promises);

        setDogs(dogData);
        setLoading(false);

        if (selectedDogId && !dogData.find((dog) => dog.id === selectedDogId)) {
            setSelectedDogId(-1);
        }
    }

    useEffect(() => {
        loadDogs();
    }, []);

    function handleBackButtonClicked() {
        setDogId(undefined);
        setMode(MyDogsMode.list);
        scrollToTop();
    }

    return (
        <>
            <MyDogsContext.Provider
                value={{
                    dogId: dogId,
                    dogs: dogs,
                    mode: mode,
                    backButtonClicked: handleBackButtonClicked,
                    reloadDogs: loadDogs,
                }}
            >
                {mode === MyDogsMode.create && <CreateEditDog />}
                {mode === MyDogsMode.edit && <CreateEditDog />}
                {mode === MyDogsMode.list && (
                    <>
                        {/* {" "} */}
                        <h1 className="text-pink-700">Moje pieski</h1>
                        {/* <MyButton text="ref" onClick={loadDogs} /> */}
                        {loading ? (
                            <LoadingAnim />
                        ) : (
                            <>
                                {" "}
                                {dogs &&
                                    dogs!.map((dogModel) => {
                                        return (
                                            <MyDogTile
                                                key={dogModel.id}
                                                dogName={dogModel.name}
                                                location={
                                                    dogModel.city ?? "nigdzie"
                                                }
                                                matchCount={0}
                                                imgPath={
                                                    dogModel.imgPath ??
                                                    "/dogImagePlaceholder.png"
                                                }
                                                phone="none"
                                                onEditClicked={(e) => {
                                                    console.log(
                                                        `start editing dog with id:${dogModel.id}`
                                                    );
                                                    e.stopPropagation();
                                                    setMode(MyDogsMode.edit);
                                                    setDogId(dogModel.id);
                                                    scrollToTop();
                                                }}
                                                selected={
                                                    selectedDogId ===
                                                    dogModel.id
                                                }
                                                onTileClicked={(e) => {
                                                    console.log(
                                                        "clicked " + dogModel.id
                                                    );
                                                    setSelectedDogId(
                                                        dogModel.id
                                                    );
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
                                        scrollToTop();
                                    }}
                                ></MyButton>{" "}
                            </>
                        )}
                    </>
                )}

                <div className="min-h-10 min-w-5"></div>
            </MyDogsContext.Provider>
        </>
    );
}
