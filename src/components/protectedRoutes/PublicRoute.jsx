import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userRole = localStorage.getItem("role");

    if (isLoggedIn) {
        if (userRole === 'admin') return <Navigate to="/admin" replace />;
        if (userRole === 'student') return <Navigate to="/student" replace />;
        if (userRole === 'teacher') return <Navigate to="/teacher" replace />;

        // return <Navigate to="/" replace />;
    }

    return <Outlet />;
};