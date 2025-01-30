import { extendTailwindMerge } from "tailwind-merge";

export const customTwMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            shrink: ["shrink-0", "shrink", "shrink-1"], // Definiujemy grupę klas "shrink"
        },
    },
});
