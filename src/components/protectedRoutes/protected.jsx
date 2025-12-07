import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ allowedRoles }) => {

    const userRole = localStorage.getItem("role");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        if (userRole === 'student') return <Navigate to="/student" replace />;
        if (userRole === 'teacher') return <Navigate to="/teacher" replace />;
        if (userRole === 'admin') return <Navigate to="/admin" replace />;

        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};