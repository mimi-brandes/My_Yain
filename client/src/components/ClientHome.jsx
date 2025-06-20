import React from 'react';
import '../css/ClientHome.css';
import { UserContext } from '../userContext';
import { useContext, useEffect } from 'react';
import { Outlet, replace, useNavigate } from 'react-router-dom';
const ClientHome = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setCurrentUser(null);
    navigate('/');
    // לא צריך לנווט כאן כי ה־useEffect כבר יעיף אותו
  };

  return (
    <div className="home-container">
      <img src="/images/logo.png" alt="logo" className="logo" />
      <div className="overlay">
        <h1>שלום {currentUser ? currentUser.FullName : 'טוען...'}</h1>
        {console.log(currentUser)}
        <div className="main-buttons">
          <div className="main-button wine-button1" onClick={() => navigate('/wines')}>
            <span className="button-text">היינות שלנו</span>
          </div>
          <div className="main-button tours-button1" onClick={() => navigate('/tours')}>
            <span className="button-text">הסיורים שלנו</span>
          </div>
        </div>
        <button onClick={logout} className="logout-button">התנתקות</button>
        <div className="contact-section">
          <h2>צור קשר</h2>
          <p>📞 052-1234567</p>
          <p>✉️ myyain@example.com</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src="/images/facebook.png" alt="Facebook" />
              פייסבוק
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <img src="/images/instagram.png" alt="Instagram" />
              אינסטגרם
            </a>
            <a
              href="https://wa.me/972545212931"
              target="_blank"
              rel="noreferrer"
              className="whatsapp-link"
              title="צור קשר בווטסאפ"
            >
              <img src="/images/whatsapp.png" alt="WhatsApp" />
              וואטסאפ
            </a>
            <a href="https://maps.google.com?q=MyYain" target="_blank" rel="noreferrer">
              📍 איך להגיע
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHome;