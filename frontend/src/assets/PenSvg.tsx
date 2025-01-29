import { SVGProps } from "react";

export const PenSvg = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M0 9.55568V12H2.44432L9.65345 4.79087L7.20913 2.34655L0 9.55568ZM12 2.44432L9.55568 0L7.90657 1.65562L10.3509 4.09995L12 2.44432Z"
            // fill="white"
        />
    </svg>
);
