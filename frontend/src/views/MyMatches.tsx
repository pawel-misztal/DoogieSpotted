import { useContext, useEffect, useState } from "react";
import MyMatchTile from "../components/MyMatchTile";
import LoadingAnim from "../components/LoadingAnim";
import { MatchModel } from "../models/matchModel";
import { NavContext } from "../providers/NavContext";
import { fetchApi } from "../utils/fetchApi";
import { dogModel } from "../models/dogModel";
import { API_ADDR } from "../utils/address";

export default function MyMatches() {
    const [loading, setLoading] = useState(false);

    const [dogs, setDogs] = useState<dogModel[]>();
    const { selectedDogId } = useContext(NavContext);

    async function LoadMatches() {
        if (selectedDogId === -1) return;
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
                                    location={`${dogModel.longitude} ${dogModel.latitude}`}
                                    imgPath={
                                        dogModel.imgPath ??
                                        "/dogImagePlaceholder.png"
                                    }
                                    phone="none"
                                    distance={1}
                                />
                            );
                        })}
                    <div className="min-h-4 min-w-4"></div>
                </>
            )}
        </>
    );
}
