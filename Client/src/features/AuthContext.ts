import React, { createContext, useContext, useState, useEffect } from "react";
import { type LoginResponse } from "../services/AuthService";
import { jwtDecoder } from "../utils/jwtDecoder";

interface AuthContextType {
    user: LoginResponse | null;
    login: (data: LoginResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<LoginResponse | null>(null);

    useEffect(() => {        
        // Restore from localStorage on refresh
        const token = localStorage.getItem("jwt_token");
        const userData = jwtDecoder(token || "");
        
        
        if (token && userData) {
            try {
                setUser(userData);
            } catch (error) {
                localStorage.removeItem("jwt_token");
                setUser(null);
            }
        } else {
            console.log("AuthProvider: No token or user data found in localStorage");
        }
    }, []);

    const login = (data: LoginResponse) => {
        localStorage.setItem("jwt_token", data.token);
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem("jwt_token");
        setUser(null);
    };

    return React.createElement(
        AuthContext.Provider,
        { value: { user, login, logout } },
        children
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};

export const AuthDebugger: React.FC = () => {
    const { user } = useAuth();

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
        `User: ${user ? 'Logged in' : 'Not logged in'}`
    );
};
