/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                monrope: ["Manrope", "serif"],
            },
            boxShadow: {
                dogTile: "0 4px 4px 0 rgb(0 0 0 / 0.25)",
                navBar: "0 0 10px 2px rgb(0 0 0 / 0.5)",
            },
        },
    },
    plugins: [],
};
