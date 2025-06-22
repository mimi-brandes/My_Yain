import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchServer } from '../service/server';
import { baseURL } from '../config';
import { useCart } from './CartContext';
import '../css/OrderWines.css';

function OrderWines() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const wineTypeID = state?.wineTypeID;
  const wineTypeName = state?.wineTypeName;

  const [wines, setWines] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [filter, setFilter] = useState('default');
  const { cart, addToCart } = useCart();

  /* --- שליפת יינות --- */
  useEffect(() => {
    if (!wineTypeID) return navigate('/wines');
    fetchServer(`/wines/${wineTypeID}`)
      .then(data => data && setWines(data));
  }, [wineTypeID, navigate]);

  /* --- שינוי כמות --- */
  const updateQuantity = (wineID, delta) => {
    setQuantities(prev => {
      const next = Math.max(0, (prev[wineID] || 0) + delta);
      return { ...prev, [wineID]: next };
    });
  };

  /* --- הוספה לסל --- */
  const handleAddToCart = (wineID) => {
    const qty = quantities[wineID] || 0;
    if (qty === 0) return alert('Please select quantity greater than zero');
    addToCart(wineID, qty);
    setQuantities(prev => ({ ...prev, [wineID]: 0 }));
  };

  /* --- מיון --- */
  let displayedWines = [...wines];
  if (filter === 'price-asc') displayedWines.sort((a, b) => a.Price - b.Price);
  if (filter === 'price-desc') displayedWines.sort((a, b) => b.Price - a.Price);
  if (filter === 'name-asc') displayedWines.sort((a, b) => a.WineName.localeCompare(b.WineName));
  if (filter === 'name-desc') displayedWines.sort((a, b) => b.WineName.localeCompare(a.WineName));

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="order-wines-container">
      <img src="/images/logo.png" alt="logo" className="logo" />
      <button className="cart-button" title="Go to Cart" onClick={() => navigate('/cart')}>
        <span className="cart-icon">🛒</span>
        {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
      </button>

      <h1 className="order-title">Our Wines - {wineTypeName}</h1>

      <div className="filter-container">
        <select
          className="filter-select"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="default">Sort By</option>
          <option value="price-asc">Price - Low to High</option>
          <option value="price-desc">Price - High to Low</option>
          <option value="name-asc">Name - A to Z</option>
          <option value="name-desc">Name - Z to A</option>
        </select>
      </div>

      <div className="wineOrder-grid">
        {displayedWines.map(wine => (
          <div key={wine.WineID} className="wineOrder-card">
            <div
              className="wineOrder-image"
              style={{ backgroundImage: `url(${baseURL}/${wine.ImageURL})` }}
            />
            <div className="wineOrder-info">
              <div className="wineOrder-name">{wine.WineName}</div>
              <div className="wineOrder-price">₪{parseFloat(wine.Price).toFixed(2)}</div>

              <div className="quantity-control">
                <button
                  className="quantity-button"
                  onClick={() => updateQuantity(wine.WineID, -1)}
                  disabled={(quantities[wine.WineID] || 0) <= 0}
                >-</button>

                <div className="quantity-display">{quantities[wine.WineID] || 0}</div>

                <button
                  className="quantity-button"
                  onClick={() => updateQuantity(wine.WineID, 1)}
                  disabled={(quantities[wine.WineID] || 0) >= wine.StockQuantity}
                  title={`Stock: ${wine.StockQuantity}`}
                >+</button>
              </div>

              <button
                className="add-to-cart-button"
                onClick={() => handleAddToCart(wine.WineID)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderWines;
