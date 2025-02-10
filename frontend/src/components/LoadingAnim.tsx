import { twMerge } from "tailwind-merge";
import { LoadingSvg } from "../assets/LoadingAnim";

interface LoadingAnimProps {
    className?: string;
    containerClassName?: string;
}

export default function LoadingAnim({
    className,
    containerClassName,
}: LoadingAnimProps) {
    return (
        <div
            className={twMerge(
                "flex flex-col items-center justify-center w-full max-h-dvh min-h-[500px]",
                containerClassName
            )}
        >
            <LoadingSvg
                className={twMerge(
                    "fill-pink-700 animate-spin text-slate-300 size-32",
                    className
                )}
            />
        </div>
    );
}
