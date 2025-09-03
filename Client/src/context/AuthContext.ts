import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecoder } from "../utils/jwtDecoder";

interface AuthContextType {
    roles: string | string[];
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [roles, setRoles] = useState<string[]>(() => {
        const savedToken = localStorage.getItem("jwt_token");
        if (savedToken) {
            try {
                const decoded = jwtDecoder(savedToken);
                return Array.isArray(decoded) ? decoded : decoded ? [decoded] : [];
            } catch {
                return [];
            }
        }
        return [];
    });

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("jwt_token");
    });

    useEffect(() => {
        const savedToken = localStorage.getItem("jwt_token");
        if (savedToken) {
            try {
                const decoded = jwtDecoder(savedToken);
                if (!decoded) throw new Error("Invalid token");
                const userRoles = Array.isArray(decoded)
                    ? decoded
                    : decoded
                        ? [decoded]
                        : [];
                setToken(savedToken);
                setRoles(userRoles);
            } catch (error) {
                setToken(null);
                setRoles([]);
            }
        }
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem("jwt_token", newToken);
        try {
            const decoded = jwtDecoder(newToken);
            if (!decoded) throw new Error("Invalid token");
            const userRoles = Array.isArray(decoded)
                ? decoded
                : decoded
                    ? [decoded]
                    : [];
            setToken(newToken);
            setRoles(userRoles);
        } catch (error) {
            console.error("Invalid token at login:", error);
            setToken(null);
            setRoles([]);
        }
    };

    const logout = () => {
        localStorage.removeItem("jwt_token");
        setToken(null);
        setRoles([]);
    };

    const hasRole = (role: string) => roles.includes(role);

    return React.createElement(
        AuthContext.Provider,
        { value: { roles, token, login, logout, hasRole } },
        children
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};

export const AuthDebugger: React.FC = () => {
    const { token, roles } = useAuth();

    return React.createElement(
        "div",
        {
            style: {
                position: 'fixed',
                top: 0,
                right: 0,
                background: 'red',
                color: 'white',
                padding: '10px',
                zIndex: 9999
            }
        },
        `User: ${token ? 'Logged in' : 'Not logged in'} | Roles: ${roles}`
    );
};
