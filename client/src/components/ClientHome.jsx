import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext';
import '../css/ClientHome.css';

const ClientHome = () => {
  const { currentUser, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);



  return (
    <div className="home-container">
      <img src="/images/logo.png" alt="logo" className="logo" />
      <div className="overlay">
        <h1>שלום {currentUser ? currentUser.FullName : 'טוען...'}</h1>
        <div className="main-buttons">
          <div className="main-button wine-button1" onClick={() => navigate('/wines')}>
            <span className="button-text">היינות שלנו</span>
          </div>
          <div className="main-button tours-button1" onClick={() => navigate('/tours')}>
            <span className="button-text">הסיורים שלנו</span>
          </div>
        </div>
        {/* <button onClick={logout} className="logout-button">התנתקות</button> */}

        <div className="extra-buttons">
          <button onClick={() => setShowVideo(true)} className="video-button">
            צפייה ביקב שלנו 🎥
          </button>
          <button onClick={logout} className="logout-button">התנתקות</button>
        </div>

        {/* מודל לצפייה בסרטון */}
        {showVideo && (
          <div className="video-modal">
            <div className="video-content">
              <span className="close-button" onClick={() => setShowVideo(false)}>×</span>
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/tS5grepeEnA"
                title="סרטון היקב שלנו"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

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