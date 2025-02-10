import { useState } from "react";
import { DogFeetsSvg } from "../assets/DogFeetsSvg";
import MyButton from "../components/MyButton";
import Matcher from "./Matcher";
import { BackSvg } from "../assets/BackArrow";
import { dogQuotes } from "../utils/cytaty";

export default function Home() {
    const [isMatchesVisible, setIsMatchesVisible] = useState(false);

    function GetQuote() {
        const quoteIndex =
            Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % dogQuotes.length;
        return dogQuotes[quoteIndex];
    }

    return (
        <>
            {isMatchesVisible === false && (
                <div className="flex flex-col w-full items-start gap-8 py-8">
                    <div className="flex flex-col w-full items-center gap-2 my-4">
                        <div className="text-4xl font-bold">Cytat na dziś:</div>
                        <div className="text-2xl italic">"{GetQuote()}"</div>
                    </div>
                    <a href="https://www.pedigree.pl">
                        <img src="PedigreeAd.jpg" className="rounded-xl" />
                    </a>
                    <MyButton
                        className="bg-slate-900 w-full"
                        text="Szukaj maczy"
                        elementAfter={<DogFeetsSvg />}
                        onClick={() => setIsMatchesVisible(true)}
                    />
                </div>
            )}
            {isMatchesVisible && (
                <>
                    <MyButton
                        text="wróć"
                        className="bg-transparent text-pink-700 font-monrope text-sm px-0 py-0 gap-6"
                        elementBefore={<BackSvg />}
                        onClick={() => setIsMatchesVisible(false)}
                    />
                    <Matcher />
                </>
            )}
        </>
    );
}
