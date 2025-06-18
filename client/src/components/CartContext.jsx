import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});   // { wineID: quantity }

  const addToCart = (wineID, qty) => {
    if (qty <= 0) return;
    setCart(prev => ({
      ...prev,
      [wineID]: (prev[wineID] || 0) + qty
    }));
  };

  const removeFromCart = (wineID) => {
    setCart(prev => {
      const next = { ...prev };
      delete next[wineID];
      return next;
    });
  };
  const updateCartQuantity = (wineID, qty) => {
    setCart(prev => ({
      ...prev,
      [wineID]: qty > 0 ? qty : 0
    }));
  };
  const clearCart = () => setCart({});

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart,updateCartQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};