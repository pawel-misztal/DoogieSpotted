import { useNavigate } from "react-router-dom";
import "./App.css";
import { HeartSvg } from "./assets/HeartSvg";
import MatchTile from "./components/MatchTile";
import MyButton from "./components/MyButton";
import MyDogTile from "./components/MyDogTile";
import MyInput from "./components/MyInput";
import useApi from "./hooks/useApi";
import { useEffect, useState } from "react";
import { API_ADDR } from "./utils/address";
import { LogoSimpleSvg } from "./assets/LogoSimpleSvg";
export default function Components() {
    const nav = useNavigate();

    // const [img, setImg] = useState<string>("");

    // const { data, handleFetch } = useApi<Blob>();

    // useEffect(() => {
    //     handleFetch({
    //         url: "/api/dogs/1/images/1",
    //         expectedOutput: "BLOB",
    //     });
    // }, []);

    // useEffect(() => {
    //     console.log("Data is loaded " + data);
    //     if (data) {
    //         const url = URL.createObjectURL(data);
    //         console.log(url);
    //         setImg(url);
    //     }
    // }, [data]);

    return (
        <>
            <MyButton text="match" elementBefore={<HeartSvg />} />

            <MyButton
                text="go to app"
                elementBefore={<HeartSvg />}
                elementAfter={<HeartSvg />}
                onClick={() => {
                    nav("/app");
                }}
            ></MyButton>

            <MyButton
                text="match"
                elementBefore={<HeartSvg />}
                elementAfter={<HeartSvg />}
                className="w-[18.75rem]"
            />

            <MyInput
                label="Nazwa użytkownika"
                name="Login"
                value="text"
                onChange={() => {}}
            />

            <MyInput
                label="Nazwa użytkownika"
                name="Login1"
                className="w-[18.75rem]"
                value="text"
                onChange={() => {}}
            />

            <MyInput
                label="Hasło"
                name="Login2"
                className="w-[18.75rem]"
                type="password"
                value="text"
                onChange={() => {}}
            />

            <MyInput
                label="Nazwa użytkownika"
                name="Login3"
                className="w-[18.75rem]"
                value="text"
                onChange={() => {}}
            />
            <MyDogTile
                dogName="Azorek"
                matchCount={3}
                phone="123 456 789"
                location="Sosnowiec"
                imgPath="../public/dog1png.png"
            />
            <MyDogTile
                dogName="Azorek"
                matchCount={3}
                phone="123 456 789"
                location="Sosnowiec"
                imgPath="../public/dog2png.png"
            />

            <MatchTile
                dogName="Tuptuś"
                isFemale={false}
                yearsOld={2}
                distanceKm={3}
                imgPath={"../public/dog2png.png"}
                description="lubi jeść kupke i wachać  inne psiaczki po dupce. Miłośnik starej szynki"
            />

            <MatchTile
                dogName="Paweł"
                isFemale={false}
                yearsOld={24}
                distanceKm={3}
                // imgPath={img}
                // imgPath={
                //     "api/protected/dogs/1_1_39e85cd4-19d6-47f2-9971-12db4817cc6b.jpg"
                // }
                imgPath={API_ADDR + "/api/dogs/1/images/1"}
                description="C# ❤️"
            />

            <div className="flex flex-row gap-4">
                <div className="w-12 h-12 flex-shrink-0"></div>
                <MatchTile
                    className="flex-shrink-1"
                    dogName="Tuptuś"
                    isFemale={true}
                    yearsOld={2}
                    distanceKm={3}
                    imgPath={"../public/dog2png.png"}
                    description="lubi jeść kupke i wachać  inne psiaczki po dupce. Miłośnik starej szynki"
                />
                <div className="w-12 h-12 flex-shrink-0"></div>
            </div>

            <div className="min-h-20"></div>
        </>
    );
}
