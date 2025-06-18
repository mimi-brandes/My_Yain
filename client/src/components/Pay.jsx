import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import '../css/Pay.css';

const Pay = () => {
const navigate = useNavigate();
const {clearCart} = useCart();
  const handleClick = () => {
    alert('תודה על התשלום!');
    clearCart();
    navigate('/client-home');
  };

  return (
    <div className="image-button-container">
      <img src="/images/pay.png" alt="imagePay" className="main-image" />
      <button className="checkout-button" onClick={handleClick}>שלם</button>
    </div>
  );
};

export default Pay;
