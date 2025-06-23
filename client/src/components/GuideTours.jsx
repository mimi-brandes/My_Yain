// import React, { useEffect, useState, useContext } from 'react';
// import { fetchServer } from '../service/server';
// import { UserContext } from '../userContext';
// import '../css/GuideTours.css';

// const GuideTours = () => {
//   const { currentUser } = useContext(UserContext);
//   const [tours, setTours] = useState([]);

//   useEffect(() => {
//     if (!currentUser) return;
//     const fetchTours = async () => {
//       const data = await fetchServer(`/tours/guide/${currentUser.Id}`); // לפי מזהה מדריך
//       if (data) setTours(data);
//     };
//     fetchTours();
//   }, [currentUser]);

//   return (
//     <div className="guide-tours-container">
//       <img src="/images/logo.png" alt="logo" className="logo" />
//       <h1 className="guide-tours-title">הסיורים שלי</h1>
//       <table className="tours-table">
//         <thead>
//           <tr>
//             <th>תאריך</th>
//             <th>שעה</th>
//             <th>שם קבוצה</th>
//             <th>מס׳ משתתפים</th>
//             <th>סוג סיור</th>
//             <th>הערות</th>
//             <th>פידבק של המדריך</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tours.map(tour => (
//             <tr key={tour.TourID}>
//                <td>{new Date(tour.TourDate).toLocaleDateString('he-IL')}</td>
//                 <td>{tour.TourHour?.slice(0, 5)}</td>
//                 <td>{tour.GroupName}</td>
//                 <td>{tour.GroupSize}</td>
//                 <td>{tour.TourTypeName}</td>
//                 <td>{tour.Notes || 'no notes'}</td>
//                 <td>{tour.GuideFeedback || ''}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default GuideTours;
import React, { useEffect, useState, useContext } from 'react';
import { fetchServer } from '../service/server';
import { UserContext } from '../userContext';
import '../css/GuideTours.css';

const GuideTours = () => {
  const { currentUser } = useContext(UserContext);
  const [tours, setTours] = useState([]);
  const [editTourId, setEditTourId] = useState(null);
  const [feedbackValue, setFeedbackValue] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    const fetchTours = async () => {
      const data = await fetchServer(`/tours/guide/${currentUser.Id}`);
      if (data) setTours(data);
    };
    fetchTours();
  }, [currentUser]);

  const handleEditClick = (tourId, currentFeedback) => {
    setEditTourId(tourId);
    setFeedbackValue(currentFeedback || '');
  };

  const handleCancelEdit = () => {
    setEditTourId(null);
    setFeedbackValue('');
  };

  const handleSaveFeedback = async (tourId) => {
    const res = await fetchServer(`/tours/update-feedback`, {
      TourID: tourId,
      GuideFeedback: feedbackValue
    }, 'POST');

    if (res?.success) {
      const updatedTours = tours.map(t =>
        t.TourID === tourId ? { ...t, GuideFeedback: feedbackValue } : t
      );
      setTours(updatedTours);
      setEditTourId(null);
      setFeedbackValue('');
      alert('הפידבק עודכן בהצלחה!');
    } else {
      alert('אירעה שגיאה בעדכון הפידבק');
    }
  };

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
            <th>פידבק של המדריך</th>
            <th>עריכה</th>
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
              <td>
                {editTourId === tour.TourID ? (
                  <input
                    type="text"
                    value={feedbackValue}
                    onChange={(e) => setFeedbackValue(e.target.value)}
                  />
                ) : (
                  tour.GuideFeedback || ''
                )}
              </td>
              <td>
                {editTourId === tour.TourID ? (
                  <>
                    <button onClick={() => handleSaveFeedback(tour.TourID)}>✚</button>
                    <button onClick={handleCancelEdit}>✖</button>
                  </>
                ) : (
                  <button onClick={() => handleEditClick(tour.TourID, tour.GuideFeedback)}>✏️</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuideTours;
