import React, { useEffect, useState } from 'react';
import { fetchServer } from '../service/server';
import { baseURL } from '../config';
import { useNavigate } from 'react-router-dom';
import '../css/WineTypes.css';

const WineTypes = () => {
  const navigate = useNavigate();
  const [wineTypes, setWineTypes] = useState([]);

  useEffect(() => {
    fetchServer('/wines')  // נניח שה-API מחזיר את כל סוגי היין
      .then(data => {
        if (data) setWineTypes(data);
      });
  }, []);

  return (
    <div className="wine-types-container">
      <div className="wine-overlay">
        <h1 className="wine-title">אנא בחר את סוג היין שאותו תרצה להזמין</h1>
        <div className="wine-grid">
          {wineTypes.map((wine, index) => (
            <button
              key={index}
              onClick={() =>
                navigate('/order-wine', {
                  state: {
                    wineTypeID: wine.WineTypeID,
                    wineTypeName: wine.WineTypeName
                  }
                })
              }
              className="wine-button"
            >
              <div
                className="wine-card"
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
