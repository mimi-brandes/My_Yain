import React from 'react';
import '../css/Signup.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../userContext';
import { useContext } from 'react';
import { fetchServer } from '../service/server';
//פונקציה בדיקות תקינות להרשמה
function validateFormInputs({ Tz, FullName, Email, Password, Phone, Age, BirthDate }) {
     if (!Tz || !FullName || !Email || !Password || !Phone || !Age || !BirthDate) {
          return "אנא מלא את כל השדות";
     }

     if (!/^\d{9}$/.test(Tz)) {
          return "תעודת זהות לא תקינה (חייבת להיות 9 ספרות)";
     }

     if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(Email)) {
          return "כתובת האימייל לא תקינה";
     }

     if (Password.length < 6) {
          return "הסיסמה צריכה להיות לפחות 6 תווים";
     }
     if (!/^05\d{8}$/.test(Phone)) {
          return "מספר הטלפון לא תקין (חייב להתחיל ב־05 ולהכיל 10 ספרות)";
     }
     if (Age < 18 || Age > 120) {
          return "הגיל חייב להיות בין 18 ל-120";
     }

     const birthDateObj = new Date(BirthDate);
     const today = new Date();

     let realAge = today.getFullYear() - birthDateObj.getFullYear();
     const m = today.getMonth() - birthDateObj.getMonth();
     if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
          realAge--;
     }

     if (realAge < 18) {
          return "עליך להיות בן 18 ומעלה כדי להירשם";
     }

     if (realAge !== Age) {
          return `הגיל שסיפקת (${Age}) לא תואם את תאריך הלידה (הגיל האמיתי לפי תאריך הלידה הוא ${realAge})`;
     }

     return null; // הכל תקין
}
const Signup = () => {
     //שורות קוד נוספות עבור הוספת לקוח דרך מנהל
     const location = useLocation();
     const { TypeMnager } = location.state || {};
     


     const navigate = useNavigate();
     const { setCurrentUser } = useContext(UserContext);
     const tryToSignFinally = async (e) => {
          e.preventDefault();
          const form = e.target;
          const Tz = form.Tz.value.trim();
          const FullName = form.FullName.value.trim();
          const Email = form.Email.value.trim();
          const Password = form.Password.value;
          const Phone = form.Phone.value.trim();
          const Age = Number(form.Age.value);
          const BirthDate = form.BirthDate.value;
          const validationError = validateFormInputs({ Tz, FullName, Email, Password, Phone, Age, BirthDate });
          if (validationError) {
               alert(validationError);
               return;
          }
          const userObject = {
               Tz,
               FullName,
               Email,
               Password,
               Phone,
               Age,
               BirthDate
          };
          console.log('userObject:', userObject);
          const usersResponse = await fetchServer('/users', userObject, 'POST');
          if (!usersResponse) {
               alert('אירעה שגיאה בהרשמה');
               return;
          }
          if (usersResponse) {
               
               if (TypeMnager === 'yes') {
                    alert("הלקוח נוסף בהצלחה!");
                    navigate('/manager-dashboard', { state: { type: 'customers' } });
                    return;
                }
               const newUser = {
                    ...userObject,          // כל הנתונים מהטופס
                    userType: "Customers",  // הוספת סוג משתמש
               };

               localStorage.setItem("currentUserId", JSON.stringify(newUser.Tz));
               setCurrentUser(newUser); // עכשיו יש FullName, userType וכו'
               alert("sign in succed");
               navigate('/client-home');
          }

     }
     return (
          <div className="signup-container">
               <div className="overlay">
                    <img src="/images/logo.png" alt="logo" className="logo" />
                    <h1 className="title">ברוך הבא ל-MyYain</h1>
                    <p className="subtitle">שמחים שבחרת להירשם אלינו</p>
                    <form className="signup-form" onSubmit={tryToSignFinally}>
                         <input type="text" name="Tz" placeholder="תעודת זהות" />
                         <input type="text" name="FullName" placeholder="שם מלא" />
                         <input type="email" name="Email" placeholder="מייל" />
                         <input type="password" name="Password" placeholder="סיסמה" />
                         <input type="tel" name="Phone" placeholder="טלפון" />
                         <input type="number" name="Age" placeholder="גיל" />
                         <input type="date" name="BirthDate" placeholder="תאריך לידה" />
                         <button type="submit">הרשם</button>
                    </form>
                    <p className="switch-link">
                         כבר מחובר?
                         <span className="spanLink" onClick={() => navigate('/managers-home')}>
                              התחבר
                         </span>
                    </p>
               </div>
          </div>
     );
}

export default Signup;