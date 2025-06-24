import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../userContext';
import { useContext } from 'react';
import { fetchServer } from '../service/server';
import '../css/Login.css';
const Login = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  const tryToLogin = async (e) => {
    e.preventDefault(); 
    const usersResponse = await fetchServer("/users/login", { Tz: e.target.Tz.value, Password: e.target.Password.value }, 'POST');
    if (usersResponse) {
      localStorage.setItem("currentUserId", usersResponse.Id);
      localStorage.setItem("type", usersResponse.userType);
      setCurrentUser(usersResponse); 
      switch (usersResponse.userType) {
        case "Customers":
          navigate('/client-home'); 
          break;
        case "Managers":
          navigate('/managers-home'); 
          break;
        case "Guides":
          navigate('/guides-home'); 
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
          <input type="text" name="Tz" placeholder="תעודת זהות" />
          <input type="password" name="Password" placeholder="סיסמה" />
          <button type="submit">התחבר</button>
        </form>
        <p className="error-message" style={{ display: 'none' }}>פרטים שגויים</p>
        <p className="switch-link">
          עדיין לא רשום?
          <span className="spanLink" onClick={() => navigate('/users/signup')}>
            הרשם
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;