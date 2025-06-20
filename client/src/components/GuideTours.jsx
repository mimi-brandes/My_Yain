import React, { useEffect, useState, useContext } from 'react';
import { fetchServer } from '../service/server';
import { UserContext } from '../userContext';
import '../css/GuideTours.css';

const GuideTours = () => {
  const { currentUser } = useContext(UserContext); // נניח שיש שם GuideID
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const getTours = async () => {
      const allTours = await fetchServer('/tours'); // מביא את כל הסיורים
      if (allTours && currentUser?.Id) {
        const myTours = allTours.filter(t => t.GuideID === currentUser.Id);
        setTours(myTours);
      }
    };
    getTours();
  }, [currentUser]);

  return (
    <div className="guide-tours-container">
      <h1 className="guide-tours-title">הסיורים שלי</h1>
      {tours.length === 0 ? (
        <p>אין סיורים להצגה.</p>
      ) : (
        <table className="tours-table">
          <thead>
            <tr>
              <th>תאריך</th>
              <th>שעה</th>
              <th>קבוצה</th>
              <th>מס׳ אנשים</th>
              <th>סוג סיור</th>
              <th>הערות</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.TourID}>
                <td>{new Date(tour.TourDate).toLocaleDateString('he-IL')}</td>
                <td>{tour.TourHour?.substring(0,5)}</td>
                <td>{tour.GroupName}</td>
                <td>{tour.GroupSize}</td>
                <td>{tour.TourTypeName || tour.TourTypeID}</td>
                <td>{tour.Notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GuideTours;