import { LogoSimpleSvg } from "../assets/LogoSimpleSvg";

interface DefaultBackgroundProps {
    children?: React.ReactNode;
}
export default function DefaultBackground({
    children,
}: DefaultBackgroundProps) {
    return (
        <div className="flex flex-col items-start gap-4 bg-white p-8 min-h-screen max-h-[600px] overflow-y-scroll overscroll-y-auto">
            <LogoSimpleSvg fill="black" className="min-h-10" />
            {children}
        </div>
    );
}
