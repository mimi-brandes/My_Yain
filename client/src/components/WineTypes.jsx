import React, { useEffect, useState } from 'react';
import { fetchServer } from '../service/server';
import { baseURL } from '../config';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import '../css/WineTypes.css';

const WineTypes = () => {
  const navigate = useNavigate();
  const [wineTypes, setWineTypes] = useState([]);
  const { cart } = useCart();

  useEffect(() => {
    fetchServer('/wines/types')
      .then(data => data && setWineTypes(data));
  }, []);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="wine-types-container">
      <div className="back-button-container">
          <button className="back-button" onClick={() => navigate('/client-home')}>
            חזרה
          </button>
        </div>
      <img src="/images/logo.png" alt="logo" className="logo" />
      <button className="cart-button" title="Go to Cart" onClick={() => navigate('/cart')}>
        <span className="cart-icon">🛒</span>
        {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
      </button>
      <div className="wine-overlay">
        <h1 className="wine-title">אנא בחר את סוג היין שאותו תרצה להזמין</h1>
        <div className="wineTypes-grid">
          {wineTypes.map(wine => (
            <button
              key={wine.WineTypeID}
              className="wine-button"
              onClick={() => navigate('/order-wine', {
                state: { wineTypeID: wine.WineTypeID, wineTypeName: wine.WineTypeName }
              })}
            >
              <div
                className="wineType-card"
                style={{ backgroundImage: `url(${baseURL}/${wine.ImageURL})` }}
              >
                <div className="wine-content">
                  <h2>{wine.WineTypeName}</h2>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WineTypes;
