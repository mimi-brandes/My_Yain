import React, { useEffect, useState } from 'react';
import { fetchServer } from '../service/server';
import { baseURL } from '../config';
import { useNavigate,useLocation } from 'react-router-dom';
import '../css/TourTypes.css';

const TourTypes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {TypeMnager } = location.state || {TypeMnager:''};
  const [tours, setTours] = useState([]);
  console.log(TypeMnager);
  useEffect(() => {
    fetchServer('/tours')
      .then(data => {
        if (data) setTours(data);
      });
  }, []);
  return (
    <div className="tour-types-container">
      <div className="tour-overlay">
      <img src="/images/logo.png" alt="logo" className="logo" />
        <h1 className="tour-title">Please choose a tour type</h1>
        <div className="tour-grid">
          {tours.map((tour, index) => (
            <button key={index} onClick={()=>navigate('/book-tour', { state: { tourType: tour.TourTypeName,PricePerPerson:tour.PricePerPerson,TourTypeID:tour.TourTypeID ,TypeMnager:TypeMnager} })}>
              {console.log(tour.TourTypeID)}
              <div
                className="tour-card"
                style={{ backgroundImage: `url(${baseURL}/${tour.ImageURL})` }}>
                <div className="tour-content">
                  <h2>{tour.TourTypeName}</h2>
                  <p>{tour.DescriptionT}</p>
                  <p className="tour-price">${parseInt(tour.PricePerPerson).toFixed(2)} per person</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourTypes;
