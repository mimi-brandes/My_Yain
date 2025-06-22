import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});   // { wineID: quantity }
  //הוספת פריט לסל
  const addToCart = (wineID, qty) => {
    if (qty <= 0) return;
    setCart(prev => ({
      ...prev,
      [wineID]: (prev[wineID] || 0) + qty
    }));
  };
  
  //מחיקת פריט מהסל
  const removeFromCart = (wineID) => {
    setCart(prev => {
      const next = { ...prev };
      delete next[wineID];
      return next;
    });
  };

  //עידכון כמות לפריט מהסל
  const updateCartQuantity = (wineID, qty) => {
    setCart(prev => ({
      ...prev,
      [wineID]: qty > 0 ? qty : 0
    }));
  };
  
  //ניקוי הסל
  const clearCart = () => setCart({});

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart,updateCartQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};