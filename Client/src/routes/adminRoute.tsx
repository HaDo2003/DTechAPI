import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user, token, isLoading } = useAuth();
    const location = useLocation();
    const allowedRoles = ["Admin", "Seller"];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user || !token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    const isAuthorized = allowedRoles.includes(user.roles);
    return isAuthorized ? <>{children}</> : <Navigate to="/access-denied" replace />;;
};

export default AdminRoute;
