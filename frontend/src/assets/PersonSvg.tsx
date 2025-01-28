import { SVGProps } from "react";

export const PersonSvg = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width="22"
        height="28"
        viewBox="0 0 22 28"
        fill="black"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11 11.3334C13.9455 11.3334 16.3333 8.94556 16.3333 6C16.3333 3.0545 13.9455 0.666687 11 0.666687C8.0545 0.666687 5.66663 3.0545 5.66663 6C5.66663 8.9455 8.05444 11.3334 11 11.3334ZM13.6666 14H8.33331C3.91506 14 0.333313 17.5817 0.333313 22V27.3334H21.6666V22C21.6666 17.5817 18.0849 14 13.6666 14Z"
        />
    </svg>
);
