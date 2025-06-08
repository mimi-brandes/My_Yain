import React from 'react';
import '../css/Signup.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext';
import { useContext } from 'react';
import { fetchServer } from '../service/server';
const Signup=()=> {
    const navigate = useNavigate();
    const { setCurrentUser } = useContext(UserContext);
    const tryToSignFinally = async (e) => {
         e.preventDefault(); // מניעת רענון הדף  
         const formData = new FormData(e.target);
         let userObject = {};
         for (const [key, value] of formData.entries()) {
              const keys = key.split('.'); // Split keys for nested structure
              let current = userObject;
              keys.forEach((k, index) => {
                   if (index === keys.length - 1) {
                        current[k] = value; // Assign value to the final key
                   } else {
                        current[k] = current[k] || {}; // Create nested object if it doesn't exist
                        current = current[k];
                   }
              });
         };
     //     userObject.username = tempName; // הוספת שדה username
     //     userObject.website = tempPassword; // הוספת שדה website
         const usersResponse = await fetchServer('/users', userObject, 'POST');
         if (usersResponse) {
              localStorage.setItem("currentUserId", JSON.stringify(usersResponse.id));
              setCurrentUser(usersResponse); // שמירת פרטי המשתמש ב-Context
              alert("sign in succed");
              navigate('/home/users/' + usersResponse.id);
         }
    }

    const changeToLogin = () => {
         navigate('/');
    };

  return (
    <div className="signup-container">
      <div className="overlay">
        <img src="/images/logo.png" alt="logo" className="logo" />
        <h1 className="title">ברוך הבא ל-MyYain</h1>
        <p className="subtitle">שמחים שבחרת להירשם אלינו</p>
        <form className="signup-form" onSubmit={tryToSignFinally}>
          <input type="text" placeholder="תעודת זהות" />
          <input type="text" placeholder="שם מלא" />
          <input type="email" placeholder="מייל" />
          <input type="password" placeholder="סיסמה" />
          <input type="tel" placeholder="טלפון" />
          <input type="number" placeholder="גיל" />
          <input type="date" placeholder="תאריך לידה" />
          <button type="submit">הרשם</button>
        </form>
        <p className="switch-link">כבר רשום? <a href="/login">התחבר</a></p>
      </div>
    </div>
  );
}

export default Signup;