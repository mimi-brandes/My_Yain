import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext';
import '../css/ManegerHome.css';

const ManagerHome = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="manager-home-container">
      <img src="/images/logo.png" alt="logo" className="manager-logo" />
      <div className="manager-overlay">
        <h1>שלום {currentUser ? currentUser.FullName : 'טוען...'}</h1>
        <div className="manager-buttons">
          <div className="manager-button wines-button" onClick={() => navigate('/manager-dashboard', { state: { type: 'wines' } })}>
            <span className="manager-button-text">יינות</span>
          </div>
          <div className="manager-button tours-button" onClick={() => navigate('/manager-dashboard', { state: { type: 'tours' } })}>
            <span className="manager-button-text">סיורים</span>
          </div>
          <div className="manager-button guides-button" onClick={() => navigate('/manager-dashboard', { state: { type: 'guides' } })}>
            <span className="manager-button-text">מדריכים</span>
          </div>
          <div className="manager-button managers-button" onClick={() => navigate('/manager-dashboard', { state: { type: 'managers' } })}>
            <span className="manager-button-text">מנהלים</span>
          </div>
          <div className="manager-button customers-button" onClick={() => navigate('/manager-dashboard', { state: { type: 'customers' } })}>
            <span className="manager-button-text">לקוחות</span>
          </div>
          <div className="manager-button orders-button" onClick={() => navigate('/manager-dashboard', { state: { type: 'sales' } })}>
            <span className="manager-button-text">הזמנות</span>
          </div>
          <div className="manager-button orders-button" onClick={() => navigate('/manager-dashboard', { state: { type: 'productsSold' } })}>
            <span className="manager-button-text">יינות שנמכרו</span>
          </div>
        </div>
        <button className="manager-logout-button" onClick={logout}>התנתקות</button>
      </div>
    </div>
  );
};

export default ManagerHome;
