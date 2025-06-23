import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchServer } from '../service/server';
 import { UserContext } from '../userContext';
import '../css/BookTour.css';
function validateBookingInputs({ groupSize, tourDate, tourHour }) {
  // בדיקת מספר אנשים בקבוצה - חייב להיות מספר חיובי גדול מ-0
  if (!groupSize || isNaN(groupSize) || groupSize <= 0) {
    return "מספר האנשים בקבוצה חייב להיות מספר חיובי הגדול מ-0";
  }

  // בדיקת תאריך התור
  const today = new Date();
  const selectedDate = new Date(tourDate);
  
  // אפס את השעות, הדקות והשניות של התאריך שנבחר כדי להשוות רק תאריכים בלי זמן
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return "תאריך התור לא יכול להיות בעבר";
  }

  if (selectedDate.getTime() === today.getTime()) {
    // אם התאריך הוא היום, יש לבדוק את השעה
    if (!tourHour) {
      return "אנא בחר שעת תור";
    }

    // השעה מהטופס היא מחרוזת כמו "14:30"
    const [hour, minute] = tourHour.split(':').map(Number);

    const now = new Date();

    // זמן התור בשעות ובדקות ביחס להיום
    const tourDateTime = new Date();
    tourDateTime.setHours(hour, minute, 0, 0);

    if (tourDateTime <= now) {
      return "שעת התור חייבת להיות לאחר השעה הנוכחית אם התאריך הוא היום";
    }
  }

  // אם עבר את כל הבדיקות
  return null;
}

const BookTour = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const { tourType, PricePerPerson,TourTypeID ,TypeMnager} = location.state || { tourType: 'Unknown Tour', PricePerPerson: 0 ,TourTypeID:'',TypeMnager:''};
  // מצב חדש לשמירת כמות האנשים
  const [groupSize, setGroupSize] = useState("");
  // מצב חדש לשמירת סך התשלום
  const [totalPrice, setTotalPrice] = useState(0);
  // useEffect שירוץ בכל פעם ש-groupSize או PricePerPerson משתנים
  console.log(TypeMnager);
  useEffect(() => {
    const size = parseInt(groupSize); // המר את groupSize למספר שלם
    if (!isNaN(size) && size > 0 && PricePerPerson > 0) {
      setTotalPrice(size * PricePerPerson);
    } else {
      setTotalPrice(0); // אם הקלט לא תקין, אפס את הסכום
    }
  }, [groupSize, PricePerPerson]); // תלויות: הפעל מחדש כשאחד מאלה משתנה

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const groupSizeNum = parseInt(groupSize);

    const validationError = validateBookingInputs({
      groupSize: groupSizeNum,
      tourDate: form.TourDate.value,
      tourHour: form.TourHour.value,
    });

    if (validationError) {
      alert(validationError);
      return;
    }

    const bookingDetails = {
      groupSize: groupSizeNum,
      groupName: form.GroupName.value,
      tourHour: form.TourHour.value,
      tourDate: form.TourDate.value,
      notes: form.Notes.value,
      TourTypeID:TourTypeID,
      CustomerID:currentUser?.Id,
    };
   
      // נשלח את פרטי ההזמנה לשרת
      const response = await fetchServer('/tours/book', bookingDetails, 'POST'); // נניח שהנתיב הוא 'tours/book'
      if(!response){
        alert("There was an error booking your tour. Please try again.");
      }
      if (response) {
        alert(`Thank you for booking the ${tourType} tour!`);
        if(TypeMnager==''){navigate('/client-home');}
        else {navigate('/manager-dashboard', { state: { type: 'tours' } });}
        
      }
    
  };

  return (
    <div className="book-tour-container">
      <div className="overlay">
      <img src="/images/logo.png" alt="logo" className="logo" />
        <h1 className="title">Please fill in the details for the tour:</h1>
        <h2 className="tour-name-display">{tourType}</h2>
        <form className="book-tour-form" onSubmit={handleSubmit}>
          <input
            type="number"
            name="GroupSize"
            placeholder="Group Size"
            required
            min="1" // וודא שזה לפחות 1
            value={groupSize} // השדה מקבל את הערך ממצב ה-groupSize
            onChange={(e) => setGroupSize(e.target.value)} // עדכן את מצב ה-groupSize בכל שינוי
          />
          <input type="text" name="GroupName" placeholder="Group Name" required />
          <input type="time" name="TourHour" placeholder="Tour Hour" required />
          <input type="date" name="TourDate" placeholder="Tour Date" required />
          <textarea name="Notes" placeholder="Notes (optional)"></textarea>
          <p>סך הכל לתשלום: {totalPrice}$</p>
          <button type="submit">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
};

export default BookTour;
