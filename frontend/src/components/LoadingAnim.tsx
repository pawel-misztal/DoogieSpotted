import { twMerge } from "tailwind-merge";
import { LoadingSvg } from "../assets/LoadingAnim";

interface LoadingAnimProps {
    className?: string;
}

export default function LoadingAnim({ className }: LoadingAnimProps) {
    return (
        <div className="flex flex-col items-center justify-center w-full max-h-dvh min-h-[500px]">
            <LoadingSvg
                className={twMerge(
                    "fill-pink-700 animate-spin text-slate-300 size-32",
                    className
                )}
            />
        </div>
    );
}
