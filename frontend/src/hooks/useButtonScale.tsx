import { useRef, useEffect } from "react";

export function useButtonScale(
    scaleFactor: number,
    minDistanceToActivate: number = 100,
    onClick?: () => void,
    onThresholdReached?: () => void,
    onThresholdUnreached?: () => void
) {
    const ref = useRef<SVGSVGElement>(null);
    const btnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!btnRef.current) return;
        if (!ref.current) return;

        const _ref = ref;
        const _btnRef = ref;

        let startPos = 0;
        let distance = 0;

        let thresholdReached = false;
        let touched = false; // this is to prevent from double clicking when touch and click event is fired on mobile devices
        function handleStart(e: TouchEvent) {
            touched = true;
            startPos = e.changedTouches[0].clientX;
            distance = 0;
        }
        function handleMove(e: TouchEvent) {
            distance = Math.abs(e.changedTouches[0].clientX - startPos);

            if (
                distance >= minDistanceToActivate &&
                thresholdReached === false
            ) {
                thresholdReached = true;
                onThresholdReached?.();
            } else if (
                distance < minDistanceToActivate &&
                thresholdReached === true
            ) {
                thresholdReached = false;
                onThresholdUnreached?.();
            }
        }
        function handleEnd(e: TouchEvent) {
            // touched = false;
            if (ref.current === null) return;
            if (distance >= minDistanceToActivate) onClick?.();

            distance = 0;
        }

        function handleClick(e: MouseEvent) {
            // touched = false;
            if (touched) return;
            onClick?.();
        }

        let runAnim = true;
        let val = 1;
        function anim() {
            if (!ref) return;
            if (!ref.current) return;
            const t = 0.7;
            val = val * t + (1 - t) * distance;

            const scale = Math.max(val / 10, 1);
            ref.current.style.scale = (
                Math.sqrt(scale) * scaleFactor
            ).toString();

            if (runAnim) requestAnimationFrame(anim);
            // else console.log("stop anim");
        }
        anim();
        btnRef.current.addEventListener("touchstart", handleStart);
        btnRef.current.addEventListener("touchmove", handleMove);
        btnRef.current.addEventListener("touchend", handleEnd);
        btnRef.current.addEventListener("click", handleClick);

        return () => {
            // console.log("cleaning");
            runAnim = false;
            onThresholdUnreached?.();
            if (_btnRef.current === null) return;
            _btnRef.current.removeEventListener("touchstart", handleStart);
            _btnRef.current.removeEventListener("touchmove", handleMove);
            _btnRef.current.removeEventListener("touchend", handleEnd);
            _btnRef.current.removeEventListener("click", handleClick);
        };
    }, []);

    return { ref, btnRef };
}
