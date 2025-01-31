import { ChangeEvent, TextareaHTMLAttributes, useId } from "react";
import { ClassNameValue, twMerge } from "tailwind-merge";

interface MyTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    //
    value: string;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    name: string;
    label?: string;
    className?: string | undefined;
    labelClassName?: string | undefined;
    inputClassName?: string | undefined;
}

export default function MyTestArea({
    value,
    // onChange,
    name,
    label,
    className: className,
    labelClassName,
    inputClassName,
    ...props
}: MyTextAreaProps) {
    return (
        <div className={twMerge("flex flex-col", className)}>
            <label
                htmlFor={name}
                className={twMerge(
                    "text-pink-500 text-start text-sm",
                    labelClassName
                )}
            >
                {label}
            </label>
            <textarea
                name={name}
                id={name}
                // onChange={onChange}
                value={value}
                className={twMerge(
                    "border rounded-lg h-[2.5rem] p-3 text-base  border-pink-400 text-neutral-900 focus:outline-pink-700",
                    inputClassName
                )}
                {...props}
            ></textarea>
        </div>
    );
}
