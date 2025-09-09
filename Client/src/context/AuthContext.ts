import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecoder, type User } from "../utils/jwtDecoder";
import { useCart } from "./CartContext";

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedToken = localStorage.getItem("jwt_token");
        if (savedToken) {
            try {
                const decoded = jwtDecoder(savedToken);
                if (decoded) {
                    return {
                        roles: decoded.roles ?? [],
                        name: decoded.name ?? "",
                        email: decoded.email ?? "",
                    };
                }
            } catch {
                return null;
            }
        }
        return null;
    });

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("jwt_token");
    });
    const { setCart, fetchCart } = useCart();

    useEffect(() => {
        const savedToken = localStorage.getItem("jwt_token");
        if (savedToken) {
            try {
                const decoded = jwtDecoder(savedToken);
                if (!decoded) throw new Error("Invalid token");
                setToken(savedToken);
                setUser(decoded);
            } catch (error) {
                setToken(null);
                setUser(null);
            }
        }
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem("jwt_token", newToken);
        try {
            const decoded = jwtDecoder(newToken);
            if (!decoded) throw new Error("Invalid token");
            setToken(newToken);
            setUser(decoded);
            fetchCart();
        } catch (error) {
            console.error("Invalid token at login:", error);
            setToken(null);
            setUser(null);
        }
    };

    const logout = () => {
        localStorage.removeItem("jwt_token");
        setToken(null);
        setUser(null);
        setCart(null);
    };

    const hasRole = (role: string): boolean => user?.roles.includes(role) ?? false;
    
    return React.createElement(
        AuthContext.Provider,
        { value: { user, token, login, logout, hasRole } },
        children
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};

export const AuthDebugger: React.FC = () => {
    const { token, user } = useAuth();

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
        `User: ${token ? 'Logged in' : 'Not logged in'} | Name: ${user?.name} | Email: ${user?.email} |Roles: ${user?.roles}`
    );
};
