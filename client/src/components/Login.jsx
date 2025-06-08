import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Login.css';
import { UserContext } from '../userContext';
import { useContext } from 'react';
import { fetchServer } from '../service/server';
const Login = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  const tryToLogin = async (e) => {
    e.preventDefault(); // מניעת רענון הדף  
    const usersResponse = await fetchServer("/users/login", { CustomerID: e.target.CustomerID.value, PasswordC: e.target.PasswordC.value }, 'POST');
    // מביא נתונים מהשרת ולבינתים י עצירה להמשך התוכנית
    if (usersResponse) {
      // localStorage.setItem("currentUserId", JSON.stringify(usersResponse.CustomerID));
      // setCurrentUser(usersResponse); // שמירת פרטי המשתמש ב-Context
      // navigate('/home/users/' + usersResponse.CustomerID);
      localStorage.setItem("currentUserId", JSON.stringify(usersResponse.CustomerID || usersResponse.ManagerID || usersResponse.GuideID));
      setCurrentUser(usersResponse); // שמירת פרטי המשתמש
      switch (usersResponse.userType) {
        case "Customers":
          navigate('/client-home'); // שים לב - אותיות קטנות
          break;
        case "Managers":
          navigate('/managers/home'); // ניצור את הנתיב הזה
          break;
        case "Guides":
          navigate('/guides/home'); // גם את זה ניצור
          break;
        default:
          alert("סוג משתמש לא מזוהה");
      }
    }
    else {
      alert('שם משתמש או סיסמה שגויים');
    }
  }
  return (
    <div className="login-container">
      <div className="overlay">
        <img src="/images/logo.png" alt="logo" className="logo" />
        <h2 className="title">נא מלא את פרטיך</h2>
        <form className="login-form" onSubmit={tryToLogin}>
          <input type="text" name="CustomerID" placeholder="תעודת זהות" />
          <input type="password" name="PasswordC" placeholder="סיסמה" />
          <button type="submit">התחבר</button>
        </form>
        <p className="error-message" style={{ display: 'none' }}>פרטים שגויים</p>
        <p className="switch-link">
          עדיין לא רשום? <Link to="/users/signup">הרשם</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;