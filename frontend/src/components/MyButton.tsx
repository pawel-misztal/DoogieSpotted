import { ButtonHTMLAttributes } from "react";
// import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { customTwMerge } from "../utils/customTwMerge";

interface MyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    text: string;
    elementBefore?: JSX.Element;
    elementAfter?: JSX.Element;
}

export default function MyButton({
    className = "",
    text,
    elementBefore,
    elementAfter,
    ...props
}: MyButtonProps) {
    return (
        <button
            className={customTwMerge(
                "bg-pink-700 text-white font-semibold py-2 px-6 text-base rounded-lg flex flex-row gap-[0.625rem] justify-center items-center active:bg-pink-900 transition-all duration-300 disabled:opacity-70",
                className
            )}
            {...props}
        >
            {elementBefore}
            {text}
            {elementAfter}
        </button>
    );
}
