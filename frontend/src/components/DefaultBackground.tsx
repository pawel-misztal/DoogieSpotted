import { useRef } from "react";
import { LogoSimpleSvg } from "../assets/LogoSimpleSvg";
import { DefaultBackgroundContext } from "../providers/DefaultBaackgroundContext";

interface DefaultBackgroundProps {
    children?: React.ReactNode;
}

export default function DefaultBackground({
    children,
}: DefaultBackgroundProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    function scrollToTop() {
        if (!scrollRef || !scrollRef?.current) return;

        scrollRef.current.scrollTop = 0;
    }

    return (
        <DefaultBackgroundContext.Provider
            value={{
                scrollToTop,
            }}
        >
            <div
                className="  bg-white p-8 overflow-y-scroll h-[calc(100dvh-3.5rem)] overscroll-y-auto flex flex-col"
                // style={{
                //     overscrollBehaviorBlock: "auto",
                //     scrollMargin: "100px",
                // }}
                ref={scrollRef}
            >
                <div className="flex flex-col items-start gap-4 min-h-full flex-grow">
                    <LogoSimpleSvg fill="black" className="min-h-10" />
                    {children}
                </div>
            </div>
        </DefaultBackgroundContext.Provider>
    );
}
