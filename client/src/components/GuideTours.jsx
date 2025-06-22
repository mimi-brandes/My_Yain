import React, { useEffect, useState, useContext } from 'react';
import { fetchServer } from '../service/server';
import { UserContext } from '../userContext';
import '../css/GuideTours.css';

const GuideTours = () => {
  const { currentUser } = useContext(UserContext);
  const [tours, setTours] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchTours = async () => {
      const data = await fetchServer(`/tours/guide/${currentUser.Id}`); // לפי מזהה מדריך
      if (data) setTours(data);
    };
    fetchTours();
  }, [currentUser]);

  return (
    <div className="guide-tours-container">
      <img src="/images/logo.png" alt="logo" className="logo" />
      <h1 className="guide-tours-title">הסיורים שלי</h1>
      <table className="tours-table">
        <thead>
          <tr>
            <th>תאריך</th>
            <th>שעה</th>
            <th>שם קבוצה</th>
            <th>מס׳ משתתפים</th>
            <th>סוג סיור</th>
            <th>הערות</th>
          </tr>
        </thead>
        <tbody>
          {tours.map(tour => (
            <tr key={tour.TourID}>
               <td>{new Date(tour.TourDate).toLocaleDateString('he-IL')}</td>
                <td>{tour.TourHour?.slice(0, 5)}</td>
                <td>{tour.GroupName}</td>
                <td>{tour.GroupSize}</td>
                <td>{tour.TourTypeName}</td>
                <td>{tour.Notes || 'no notes'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuideTours;
