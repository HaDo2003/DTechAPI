import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Role = "Admin" | "Seller";

interface AdminRouteProps {
    children: React.ReactNode;
    allowedRoles: Role[];
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, allowedRoles }) => {
    const { user, token, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user || !token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    const isAuthorized = allowedRoles.includes(user.roles as Role);
    return isAuthorized ? <>{children}</> : <Navigate to="/access-denied" replace />;;
};

export default AdminRoute;
