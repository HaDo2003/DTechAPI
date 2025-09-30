import React from "react";
import { Route } from "react-router-dom";
import AdminRoute from "./adminRoute";

interface RouteLinkProps {
    path?: string;
    element?: React.ReactNode;
};

const RouteLink = ({ path, element }: RouteLinkProps) => {
    return (
        <>
            <Route
                path={path}
                element={
                    <AdminRoute allowedRoles={["Admin", "Seller"]}>
                        {element}
                    </AdminRoute>
                }
            />
        </>
    );
};

export default RouteLink;