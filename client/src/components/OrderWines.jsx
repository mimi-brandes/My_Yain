import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchServer } from '../service/server';
import { baseURL } from '../config';
import '../css/OrderWines.css';

function OrderWines() {
  const location = useLocation();
  const navigate = useNavigate();
  const wineTypeID = location.state?.wineTypeID;
  const wineTypeName = location.state?.wineTypeName;

  const [wines, setWines] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [filter, setFilter] = useState('default');
  const [cart, setCart] = useState({}); // { wineID: quantity }

  useEffect(() => {
    if (!wineTypeID) {
      // אם לא קיים wineTypeID - נחזור לעמוד סוגי היין
      navigate('/wines');
      return;
    }
    fetchServer(`/wines/${wineTypeID}`)
      .then(data => {
        if (data) setWines(data);
      });
  }, [wineTypeID, navigate]);

  const updateQuantity = (wineID, change) => {
    setQuantities(prev => {
      const current = prev[wineID] || 0;
      const next = Math.max(0, current + change);
      return { ...prev, [wineID]: next };
    });
  };

  const addToCart = (wineID) => {
    const qty = quantities[wineID] || 0;
    if (qty === 0) {
      alert('Please select quantity greater than zero');
      return;
    }
    setCart(prev => {
      const currentQty = prev[wineID] || 0;
      return { ...prev, [wineID]: currentQty + qty };
    });
    setQuantities(prev => ({ ...prev, [wineID]: 0 }));
  };

  const goToCart = () => {
    navigate('/cart', { state: { cart } });
  };

  let displayedWines = [...wines];
  if (filter === 'price-asc') {
    displayedWines.sort((a, b) => a.Price - b.Price);
  } else if (filter === 'price-desc') {
    displayedWines.sort((a, b) => b.Price - a.Price);
  } else if (filter === 'name-asc') {
    displayedWines.sort((a, b) => a.WineName.localeCompare(b.WineName));
  } else if (filter === 'name-desc') {
    displayedWines.sort((a, b) => b.WineName.localeCompare(a.WineName));
  }

  const cartCount = Object.values(cart).reduce((a,b) => a + b, 0);

  return (
    <div className="order-wines-container">
      <button className="cart-button" title="Go to Cart" onClick={goToCart}>
        🛒
        {cartCount > 0 && (
          <span className="cart-count-badge">{cartCount}</span>
        )}
      </button>

      <h1 className="order-title">Our Wines - {wineTypeName}</h1>

      <div className="filter-container">
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter wines"
        >
          <option value="default">Sort By</option>
          <option value="price-asc">Price - Low to High</option>
          <option value="price-desc">Price - High to Low</option>
          <option value="name-asc">Name - A to Z</option>
          <option value="name-desc">Name - Z to A</option>
        </select>
      </div>

      <div className="wine-grid">
        {displayedWines.map(wine => (
          <div key={wine.WineID} className="wine-card">
            <div
              className="wine-image"
              style={{ backgroundImage: `url(${baseURL}/${wine.ImageURL})` }}
              alt={wine.WineName}
            />
            <div className="wine-info">
              <div className="wine-name">{wine.WineName}</div>
              <div className="wine-price">${parseInt(wine.Price).toFixed(2)}</div>
              <div className="quantity-control">
                <button
                  className="quantity-button"
                  onClick={() => updateQuantity(wine.WineID, -1)}
                  disabled={(quantities[wine.WineID] || 0) <= 0}
                >
                  -
                </button>
                <div className="quantity-display">{quantities[wine.WineID] || 0}</div>
                <button
                  className="quantity-button"
                  onClick={() => updateQuantity(wine.WineID, 1)}
                  disabled={(quantities[wine.WineID] || 0) >= wine.StockQuantity}
                  title={`Stock: ${wine.StockQuantity}`}
                >
                  +
                </button>
              </div>
              <button
                className="add-to-cart-button"
                onClick={() => addToCart(wine.WineID)}
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
