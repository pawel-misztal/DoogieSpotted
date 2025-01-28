import { ChangeEvent, InputHTMLAttributes, useId } from "react";

interface MyInputProps extends InputHTMLAttributes<HTMLInputElement> {
    //
    value: string;
    // onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    name: string;
    label?: string;
    className?: string;
    labelClassName?: string;
    inputClassName?: string;
}

export default function MyInput({
    value,
    // onChange,
    name,
    label,
    className,
    labelClassName,
    inputClassName,
    ...props
}: MyInputProps) {
    return (
        <div className={`flex flex-col ${className}`}>
            <label
                htmlFor={name}
                className={`text-pink-500 text-start text-sm ${labelClassName}`}
            >
                {label}
            </label>
            <input
                name={name}
                className={`border rounded-lg h-[2.5rem] p-3 text-base  border-pink-400 text-neutral-900 focus:outline-pink-700 ${inputClassName}`}
                {...props}
                value={value}
            />
        </div>
    );
}
