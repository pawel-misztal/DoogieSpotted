import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "./providers/AuthContext";

export default function AuthProtector() {
    const { authenticated } = useContext(AuthContext);

    if (!authenticated) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}
