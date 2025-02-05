import { useEffect, useRef, useState } from "react";
import { BtnXSvg } from "../assets/BtnXSvg";
import { HeartSvg } from "../assets/HeartSvg";
import MatchTile from "../components/MatchTile";
import { twMerge } from "tailwind-merge";
import { useButtonScale } from "../hooks/useButtonScale";
import LoadingAnim from "../components/LoadingAnim";

export default function Matcher() {
    // const [act, setAct] = useState<number>(0);
    // const ref = useRef<SVGSVGElement>(null);
    // const btnRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(true);

    const { ref: leftScaleRef, btnRef: leftButton } = useButtonScale(
        1,
        100,
        () => setShow(false),
        () => console.log("reached"),
        () => console.log("unreached")
    );

    const { ref: rightScaleRef, btnRef: rightButton } = useButtonScale(
        1,
        100,
        () => setShow(true),
        () => console.log("reached"),
        () => console.log("unreached")
    );

    // useEffect(() => {
    //     if (btnRef.current === null) return;
    //     if (ref.current === null) return;

    //     let startPos = 0;
    //     let distance = 0;

    //     function handleStart(e: TouchEvent) {
    //         startPos = e.changedTouches[0].clientX;
    //         distance = 0;
    //     }
    //     function handleMove(e: TouchEvent) {
    //         distance = Math.abs(e.changedTouches[0].clientX - startPos);
    //     }
    //     function handleEnd(e: TouchEvent) {
    //         if (ref.current === null) return;
    //         distance = 0;
    //     }

    //     let runAnim = true;
    //     let val = 1;
    //     function anim() {
    //         const t = 0.7;
    //         val = val * t + (1 - t) * distance;
    //         if (ref.current === null) return;

    //         const scale = Math.max(val / 10, 1);
    //         ref.current.style.scale = Math.sqrt(scale).toString();

    //         if (runAnim) requestAnimationFrame(anim);
    //         else console.log("stop anim");
    //     }
    //     anim();
    //     btnRef.current.addEventListener("touchstart", handleStart);
    //     btnRef.current.addEventListener("touchmove", handleMove);
    //     btnRef.current.addEventListener("touchend", handleEnd);
    //     return () => {
    //         runAnim = false;
    //         if (btnRef.current === null) return;
    //         btnRef.current.removeEventListener("touchstart", handleStart);
    //         btnRef.current.removeEventListener("touchmove", handleMove);
    //         btnRef.current.removeEventListener("touchend", handleEnd);
    //     };
    // }, []);

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
            {show ? (
                <MatchTile
                    className="shrink"
                    dogName="Tuptuś"
                    isFemale={true}
                    yearsOld={2}
                    distanceKm={3}
                    imgPath={"../public/dog2png.png"}
                    description="lubi jeść kupke i wachać  inne psiaczki po dupce. Miłośnik starej szynki"
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
