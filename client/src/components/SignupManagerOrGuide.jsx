import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/SignupManagerOrGuide.css';
import { fetchServer } from '../service/server';

const validateInputs = (formData, isGuide) => {
  const { Tz, FullName, Email, Password, Phone, WorkDays, StartHour, EndHour } = formData;

  if (!Tz.trim() || Tz.length < 8) return 'יש להזין תעודת זהות תקינה';
  if (!FullName.trim()) return 'יש להזין שם מלא';
  if (!Email.includes('@') || !Email.includes('.')) return 'כתובת מייל לא תקינה';
  if (Password.length < 6) return 'הסיסמה צריכה להכיל לפחות 6 תווים';
  if (Phone && !/^05\d{8}$/.test(Phone)) return 'מספר טלפון לא תקין';

  if (isGuide) {
    if (!WorkDays.trim()) return 'יש להזין ימי עבודה';
    if (!StartHour || !EndHour) return 'יש לבחור שעת התחלה וסיום';
  }

  return null;
};

const SignupManagerOrGuide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const TypeMnager = location.state?.TypeMnager || ''; 

  const [formData, setFormData] = useState({
    Tz: '',
    FullName: '',
    Email: '',
    Password: '',
    Phone: '',
    WorkDays: '',
    StartHour: '',
    EndHour: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateInputs(formData, TypeMnager === '');
    if (error) return alert(error);
  
    try {
      const endpoint = TypeMnager === '' ? '/managers/signup-guide' : '/managers/signup-manager';
      const dataToSend = { ...formData };
      if (TypeMnager !== '') {
        delete dataToSend.WorkDays;
        delete dataToSend.StartHour;
        delete dataToSend.EndHour;
      }
  
      const response = await fetchServer(endpoint, dataToSend, 'POST');
      // response הוא כבר JSON מפוענח, לכן נבדוק אם יש שגיאה
      if (response.error) {
        alert('שגיאה בהרשמה: ' + response.error);
        return;
      }
  
      alert('נרשמת בהצלחה!');
      const typeToSent='';
           if(TypeMnager==='') {typeToSent='guides';}
           else {typeToSent='managers';}
             navigate('/manager-dashboard', { state: { type: typeToSent } });
    } catch (err) {
      alert('שגיאה בהרשמה');
      console.error('Error in handleSubmit:', err);
    }
  };
  
  return (
    <div className="signup-container">
      <img src="/images/logo.png" alt="Logo" className="logo" />
      <div className="overlay">
        <h2 className="title">הרשמת {TypeMnager === '' ? 'מדריך' : 'מנהל'}</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input name="Tz" placeholder="תעודת זהות" value={formData.Tz} onChange={handleChange} />
          <input name="FullName" placeholder="שם מלא" value={formData.FullName} onChange={handleChange} />
          <input name="Email" placeholder="אימייל" value={formData.Email} onChange={handleChange} />
          <input name="Password" placeholder="סיסמה" type="password" value={formData.Password} onChange={handleChange} />
          <input name="Phone" placeholder="טלפון" value={formData.Phone} onChange={handleChange} />

          {TypeMnager === '' && (
            <>
              <input name="WorkDays" placeholder="ימי עבודה (1-7 מופרדים בפסיקים)" value={formData.WorkDays} onChange={handleChange} />
              <input name="StartHour" type="time" value={formData.StartHour} onChange={handleChange} />
              <input name="EndHour" type="time" value={formData.EndHour} onChange={handleChange} />
            </>
          )}

          <button type="submit">אישור</button>
        </form>
      </div>
    </div>
  );
};

export default SignupManagerOrGuide; 