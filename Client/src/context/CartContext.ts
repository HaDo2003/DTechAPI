// CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { cartService } from "../services/CartService";
import type { Cart } from "../types/Cart";
import { isExpired } from "../utils/jwtDecoder";

type CartContextType = {
    cart: Cart | null;
    cartItemCount: number;
    fetchCart: () => Promise<Cart | undefined>;
    setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [ token ] = useState<string | null>(() => {
        const savedToken = localStorage.getItem("jwt_token")
        if (savedToken === null) return null;
        const isTokenExpired = isExpired(savedToken);
        if (isTokenExpired) {
            return null;
        }
        return savedToken;
        }
    );

    const fetchCart = async () => {
        if (!token) {
            setCart(null);
            return;
        }
        try {
            const res = await cartService.getCart(token);
            if (res.success) {
                setCart(res);
                return res;
            } else {
                alert({ message: res.message || "Fail to get cart!", type: "error" });
            }
        } catch (err) {
            console.error("Failed to fetch cart", err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCart();
        } else {
            setCart(null);
        }
    }, [token]);

    const cartItemCount = cart?.cartProducts?.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
    ) || 0;

    return React.createElement(
        CartContext.Provider,
        { value: { cart, cartItemCount, fetchCart, setCart } },
        children
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
};