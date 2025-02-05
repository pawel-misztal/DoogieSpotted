import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import "./styles/index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Components from "./Components.tsx";
import Navbar from "./components/Navbar.tsx";
import Login from "./pages/Login.tsx";
import FormBase from "./pages/FormBase.tsx";
import Register from "./pages/Register.tsx";
import AuthContextProvider from "./providers/AuthContextProvider.tsx";
import AuthProtector from "./AuthProtector.tsx";
import NavContextProvider from "./providers/NavContextProvider.tsx";
import MyDogs from "./views/MyDogs.tsx";
import DefaultBackground from "./components/DefaultBackground.tsx";
import Matcher from "./views/Matcher.tsx";
import MyMatchTile from "./components/MyMatchTile.tsx";
import MyMatches from "./views/MyMatches.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthContextProvider>
            <NavContextProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<AuthProtector />}>
                            <Route
                                path=""
                                element={
                                    <>
                                        <Navbar />{" "}
                                        <DefaultBackground>
                                            <Components />
                                        </DefaultBackground>
                                    </>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <>
                                        <Navbar />
                                        <DefaultBackground>
                                            <MyMatches />
                                        </DefaultBackground>
                                    </>
                                }
                            />
                            <Route
                                path="/matches"
                                element={
                                    <>
                                        <Navbar />
                                        <DefaultBackground>
                                            <Matcher />
                                        </DefaultBackground>
                                    </>
                                }
                            />
                            <Route
                                path="/mydogs"
                                element={
                                    <>
                                        <Navbar />{" "}
                                        <DefaultBackground>
                                            <MyDogs />
                                        </DefaultBackground>
                                    </>
                                }
                            />
                            <Route
                                path="app"
                                element={
                                    <>
                                        <App />
                                    </>
                                }
                            />
                        </Route>

                        <Route
                            path="/login"
                            element={<FormBase content={<Login />} />}
                        />
                        <Route
                            path="/register"
                            element={<FormBase content={<Register />} />}
                        />
                    </Routes>
                </BrowserRouter>
            </NavContextProvider>
        </AuthContextProvider>
    </StrictMode>
);
