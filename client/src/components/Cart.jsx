import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { fetchServer } from '../service/server';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../config';
import '../css/Cart.css';

const Cart = () => {
  const { cart, clearCart, updateCartQuantity, removeFromCart } = useCart();
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const ids = Object.keys(cart).map(Number);
    if (ids.length === 0) return setItems([]);

    fetchServer('/wines/by-ids', { ids }, 'POST')
      .then(data => {
        if (data) {
          const merged = data.map(w => ({ ...w, qty: cart[w.WineID] || 0 }));
          setItems(merged);
        }
      });
  }, [cart]);

  const subtotal = items.reduce((sum, i) => sum + i.Price * i.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 349 ? 0 : 40;
  const total = subtotal + shipping;
  //בעת לחיצה על ניקוי הסל
  if (items.length === 0) {
    return (
      <div className="cart-container">
       <img src="/images/logo.png" alt="logo" className="logo" />
        <h2>הסל שלך ריק</h2>
        <button className="checkout-btn" onClick={() => navigate('/wines')}>חזור להזמנה</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <img src="/images/logo.png" alt="logo" className="logo" />
      <h1 className="cart-title">סל הקניות שלך</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>תמונה</th><th>מוצר</th><th>מחיר</th>
            <th>כמות</th><th>סה״כ</th><th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.WineID}>
              <td><img src={`${baseURL}/${item.ImageURL}`} alt={item.WineName} className="cart-img" /></td>
              <td>{item.WineName}</td>
              <td>{parseFloat(item.Price).toFixed(2)} ₪</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) => updateCartQuantity(item.WineID, parseInt(e.target.value))}
                />
              </td>
              <td>{(item.Price * item.qty).toFixed(2)} ₪</td>
              <td>
                <button className="remove-btn" onClick={() => removeFromCart(item.WineID)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-summary">
        <p>סכום ביניים: {subtotal.toFixed(2)} ₪</p>
        <p>משלוח: {shipping === 0 ? 'חינם' : `${shipping} ₪`}</p>
        <h2>סה״כ לתשלום: {total.toFixed(2)} ₪</h2>
        <button className="checkout-btn" onClick={clearCart}>נקה סל</button>
        <button className="checkout-btn" onClick={()=>navigate('/pay')}>לתשלום</button>
      </div>
    </div>
  );
};

export default Cart;
