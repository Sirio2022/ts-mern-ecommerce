import { useContext } from "react";
import { AppStateContext } from "../Store";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const { state: { userInfo } } = useContext(AppStateContext);

    if (userInfo && userInfo?.isAdmin) {
        return <Outlet />
    } else {
        return <Navigate to="/signin" />
    }
}
