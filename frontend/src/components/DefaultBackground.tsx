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
                className="  bg-white p-8 overflow-y-scroll max-h-screen min-h-screen overscroll-y-auto"
                // style={{
                //     overscrollBehaviorBlock: "auto",
                //     scrollMargin: "100px",
                // }}
                ref={scrollRef}
            >
                <div className="flex flex-col items-start gap-4 min-h-fit">
                    <LogoSimpleSvg fill="black" className="min-h-10" />
                    {children}
                </div>
            </div>
        </DefaultBackgroundContext.Provider>
    );
}
