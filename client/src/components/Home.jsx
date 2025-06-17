import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <div className="overlay">
        <img src="/images/logo.png" alt="logo" className="logo" />
        <h1 className="welcome-text">ברוכים הבאים ל-MyYain</h1>
        <p className="about-text">
          יקב MyYain נוסד מתוך אהבה לאדמה, ליין ולמסורת. אנו מזמינים אתכם להצטרף למסע של טעמים, ריחות וחוויות מהכרמים ועד לבקבוק.
        </p>
        <div className="buttons">
          <button onClick={() => navigate('/users/signup')} className="home-button">הרשמה</button>
          <button onClick={() => navigate('/users/login')} className="home-button">התחברות</button>
        </div>
        <div className="gallery">
          <img src="/images/img1.jpg" alt="יין 1" />
          <img src="/images/img2.jpg" alt="יין 2" />
          <img src="/images/img3.jpg" alt="יין 3" />
          <img src="/images/img4.jpg" alt="יין 4" />
        </div>
      </div>
    </div>
  );
}

export default Home;