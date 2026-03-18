"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    const saved = localStorage.getItem("aroy-lerd-cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart data", e);
      }
    }
    setIsLoaded(true);
  }, []);


  useEffect(() => {
    if (isLoaded && cart !== undefined) {
        try {
            localStorage.setItem("aroy-lerd-cart", JSON.stringify(cart));
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }
  }, [cart, isLoaded]);


  const addToCart = (selectedItem: any, quantity: number) => {
    // console.log(selectedItem);
    setCart((prevCart) => {

      const existingItem = prevCart.find((i) => i.id === selectedItem.id);

      if (existingItem) {
        return prevCart.map((i) =>
          i.id === selectedItem.id
            ? { 
                ...i, 
                qty: i.qty + quantity, 
                totalPrice: (i.qty + quantity) * i.price 
              }
            : i
        );
      }

      return [
        ...prevCart,
        { 
          ...selectedItem, 
          qty: quantity, 
          totalPrice: quantity * selectedItem.price 
        },
      ];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQty = (id: string | number, newQty: number) => {
    // console.log(id, newQty);
    setCart((prevCart) => {
        const validatedQty = newQty < 1 ? 1 : newQty;

        return prevCart.map((item) =>
        item.id === id
            ? { 
                ...item, 
                qty: validatedQty, 
                totalPrice: validatedQty * item.price 
            }
            : item
        );
    });
  };

  const removeItem = (id: string | number) => {
    setCart((prevCart) => {
        return prevCart.filter((item) => item.id !== id);
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, updateQty, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);