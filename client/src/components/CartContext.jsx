import React, { createContext, useContext, useState,useEffect } from 'react';


const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});  
    // 🟡 טוען את הסל מה-localStorage כאשר האפליקציה עולה
    useEffect(() => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('סל לא תקין ב-localStorage:', e);
          localStorage.removeItem('cart');
        }
      }
    }, []);
  
    // 🟢 שומר את הסל ב-localStorage בכל שינוי
    useEffect(() => {
      localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);
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