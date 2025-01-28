import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// import "./styles/App.css";
import MyButton from "./components/MyButton";
import { HeartSvg } from "./assets/HeartSvg";

function App() {
    return (
        <>
            <MyButton text="match" elementBefore={<HeartSvg />} />
        </>
    );
}

export default App;
