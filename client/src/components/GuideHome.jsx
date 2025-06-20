import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext';
import '../css/GuideHome.css';

const GuideHome = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="guide-home-container">
      <img src="/images/logo.png" alt="logo" className="guide-logo" />
      <div className="guide-overlay">
        <h1>שלום {currentUser ? currentUser.FullName : 'טוען...'}</h1>
        <div className="guide-buttons">
          <div className="guide-button view-tours-button" onClick={() => navigate('/guide-tours')}>
            <span className="guide-button-text">צפייה בסיורים שלי</span>
          </div>
          <div className="guide-button book-wine-button" onClick={() => navigate('/client-home')}>
            <span className="guide-button-text">הזמנת יין / סיור</span>
          </div>
        </div>
        <button className="guide-logout-button" onClick={logout}>התנתקות</button>
      </div>
    </div>
  );
};

export default GuideHome;
