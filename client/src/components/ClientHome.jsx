import React from 'react';
import '../css/ClientHome.css';

const ClientHome = () => {
  return (
    <div className="home-container">
      <img src="/images/logo.png" alt="logo" className="logo" />
      <div className="overlay">
        <h1 className="title">שלום ל</h1>
        <div className="main-buttons">
          <div className="main-button wine-button">היינות שלנו</div>
          <div className="main-button tours-button">הסיורים שלנו</div>
        </div>
        <button onClick={() => navigate('/')} className="logout-button">התנתקות</button>
        <div className="contact-section">
          <h2>צור קשר</h2>
          <p>📞 052-1234567</p>
          <p>✉️ myyain@example.com</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src="/images/facebook.png" alt="Facebook" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <img src="/images/instagram.png" alt="Instagram" />
            </a>
            <a href="https://maps.google.com?q=MyYain" target="_blank" rel="noreferrer">
              📍 מיקום בגוגל מפות
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHome;