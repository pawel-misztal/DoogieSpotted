// import  from "react";

interface FormBaseProps {
    content: JSX.Element;
}

export default function FormBase({ content }: FormBaseProps) {
    return (
        <div className=" min-h-screen flex flex-col items-center py-6 px-4 gap-4">
            <img src="/LogoPage.svg" width={223} height={105}></img>
            <div className="w-full rounded-3xl bg-white intems">{content}</div>
        </div>
    );
}
