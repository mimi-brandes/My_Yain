import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserContext } from '../userContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useContext(UserContext);
  const [cart, setCart] = useState({});


  useEffect(() => {
    if (currentUser?.Id) {
      const key = `cart-${currentUser.Id}`;
      const savedCart = localStorage.getItem(key);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (typeof parsedCart === 'object' && parsedCart !== null) {
            setCart(parsedCart);
          } else {
            console.warn('סל לא תקין, איפוס');
            localStorage.removeItem(key);
          }
        } catch (e) {
          console.error('שגיאה בטעינת הסל:', e);
          localStorage.removeItem(key);
        }
      } else {
        setCart({}); // אין סל שמור
      }
    }
  }, [currentUser]);

  // 🟢 שמירת הסל ב-localStorage בכל שינוי
  useEffect(() => {
    if (currentUser?.Id) {
      try {
        localStorage.setItem(`cart-${currentUser.Id}`, JSON.stringify(cart));
      } catch (e) {
        console.error("לא ניתן לשמור את הסל ב-localStorage:", e);
        alert("העגלה גדולה מדי. ננקה אותה כדי למנוע בעיה.");
        setCart({});
      }
    }
  }, [cart, currentUser]);

  // הוספת פריט
  const addToCart = (wineID, qty) => {
    if (qty <= 0) return;
    setCart(prev => ({
      ...prev,
      [wineID]: (prev[wineID] || 0) + qty
    }));
  };

  // הסרה
  const removeFromCart = (wineID) => {
    setCart(prev => {
      const updated = { ...prev };
      delete updated[wineID];
      return updated;
    });
  };

  // עדכון כמות
  const updateCartQuantity = (wineID, qty) => {
    setCart(prev => ({
      ...prev,
      [wineID]: qty > 0 ? qty : 0
    }));
  };

  // ניקוי
  const clearCart = () => setCart({});

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
