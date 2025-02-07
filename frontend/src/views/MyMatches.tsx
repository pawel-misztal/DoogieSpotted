import { useContext, useEffect, useState } from "react";
import MyMatchTile from "../components/MyMatchTile";
import LoadingAnim from "../components/LoadingAnim";
import { MatchModel } from "../models/matchModel";
import { NavContext } from "../providers/NavContext";
import { fetchApi } from "../utils/fetchApi";
import { dogModel } from "../models/dogModel";
import { API_ADDR, GET_DOG_ADDR } from "../utils/address";
import { GetDistanceBetweenTwoPlaces } from "../utils/radialDistanceCalculator";
import { Vector3 } from "../utils/vector3";

export default function MyMatches() {
    const [loading, setLoading] = useState(false);

    const [dogs, setDogs] = useState<dogModel[]>();
    const { selectedDogId } = useContext(NavContext);
    const [myDog, setMyDog] = useState<dogModel>();

    async function LoadMatches() {
        if (selectedDogId === -1) return;
        fetchApi<dogModel>({
            url: GET_DOG_ADDR(selectedDogId),
        })
            .then(([ok, dog]) => {
                if (!ok || !dog) return;
                setMyDog(dog);
            })
            .catch((e) => {
                console.log(e);
            });
        setLoading(true);
        const [matchesStatus, matches] = await fetchApi<[MatchModel]>({
            url: `/api/matches/${selectedDogId}`,
        });

        if (!matches) return;

        const dogsRes = await Promise.all(
            matches.map(async (match) => {
                if (!match.otherDog) return null;
                const [dogStatus, dog] = await fetchApi<dogModel>({
                    url: `/api/dogs/${match.otherDog}`,
                });

                if (dogStatus) return dog;
                return null;
            })
        );
        const dogsFiltered = dogsRes.filter((dog) => dog !== null);

        await Promise.all(
            dogsFiltered.map(async (dd, i) => {
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

                dogsFiltered[i].imgPath = imgPath;
            })
        );

        setDogs(dogsFiltered);

        console.log(matches);
        setLoading(false);
    }

    useEffect(() => {
        LoadMatches();
    }, []);

    return (
        <>
            {selectedDogId === -1 ? (
                <div>wybierz pchlarza</div>
            ) : loading ? (
                <LoadingAnim />
            ) : (
                <>
                    {dogs &&
                        dogs!.map((dogModel) => {
                            return (
                                <MyMatchTile
                                    key={dogModel.id}
                                    dogName={dogModel.name}
                                    location={dogModel.city}
                                    imgPath={
                                        dogModel.imgPath ??
                                        "/dogImagePlaceholder.png"
                                    }
                                    phone={
                                        dogModel.phoneNumber === ""
                                            ? "brak"
                                            : dogModel.phoneNumber
                                    }
                                    distance={
                                        myDog && dogModel
                                            ? GetDistanceBetweenTwoPlaces(
                                                  new Vector3(
                                                      myDog.x,
                                                      myDog.y,
                                                      myDog.z
                                                  ),
                                                  new Vector3(
                                                      dogModel.x,
                                                      dogModel.y,
                                                      dogModel.z
                                                  )
                                              )
                                            : 0
                                    }
                                />
                            );
                        })}
                    <div className="min-h-4 min-w-4"></div>
                </>
            )}
        </>
    );
}
