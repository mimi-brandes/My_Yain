import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { UserContext } from '../userContext';
import { fetchServer } from '../service/server';
import '../css/Pay.css';

const Pay = () => {
  const navigate = useNavigate();
  const { clearCart, cart } = useCart();
  const { currentUser } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // מחשב את פרטי הסל (כולל כמות ומחיר) לצורך שליחה לשרת
  useEffect(() => {
    const ids = Object.keys(cart).map(Number);
    if (ids.length === 0) return setCartItems([]);

    fetchServer('/wines/by-ids', { ids }, 'POST')
      .then(data => {
        if (data) {
          const merged = data.map(w => ({
            productID: w.WineID,
            WineName: w.WineName,
            Price: w.Price,
            quantity: cart[w.WineID] || 0
          }));
          setCartItems(merged);

          const subtotal = merged.reduce((sum, item) => sum + item.Price * item.quantity, 0);
          const shipping = subtotal === 0 || subtotal >= 349 ? 0 : 40;
          setTotal(subtotal + shipping);
        }
      });
  }, [cart]);

  const handleClick = async () => {
    if (!currentUser || cartItems.length === 0) {
      alert('לא ניתן לבצע רכישה - חסר מידע');
      return;
    }

    const saleData = {
      customerID: currentUser.Id,
      endPrice: total,
      cartItems: cartItems.map(i => ({
        productID: i.productID,
        quantity: i.quantity
      }))
    };

    const response = await fetchServer('/wines/sale', saleData, 'POST');
    if (response && response.saleID) {
      alert('תודה על התשלום!');
      clearCart();
      navigate('/client-home');
    } else {
      alert('אירעה שגיאה בעת ביצוע התשלום');
    }
  };

  return (
    <div className="image-button-container">
      <img src="/images/pay.png" alt="imagePay" className="main-image" />
      <button className="checkout-button" onClick={handleClick}>שלם</button>
    </div>
  );
};

export default Pay;
