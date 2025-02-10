import { InputHTMLAttributes } from "react";
import { customTwMerge } from "../utils/customTwMerge";
import { twMerge } from "tailwind-merge";

export interface SliderWithValProps
    extends InputHTMLAttributes<HTMLInputElement> {
    min: number;
    max: number;
    step: number;
    id: string;
    value: string | number | readonly string[] | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    sliderClassName?: string;
    labelClassName?: string;
    label: string;
}

export default function SliderWithVal({
    min,
    max,
    step,
    id,
    sliderClassName,
    labelClassName,
    label,
    value,
    onChange,
    ...props
}: SliderWithValProps) {
    return (
        <div className="flex flex-col gap-3 mb-6">
            <label
                htmlFor={id}
                className={twMerge(
                    "text-pink-500 text-start text-sm",
                    labelClassName
                )}
            >
                {label}
            </label>
            <div className="flex flex-row gap-5 items-center">
                <div className="text-2xl text-nowrap min-w-[80px]">
                    {value} km
                </div>
                <input
                    type="range"
                    min={min}
                    max={max}
                    id={id}
                    name={id}
                    step={step}
                    className={customTwMerge("w-full slider", sliderClassName)}
                    value={value}
                    onChange={onChange}
                    {...props}
                />
            </div>
        </div>
    );
}
