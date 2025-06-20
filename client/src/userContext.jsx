// import { useState, createContext, useEffect } from 'react';
// import { fetchServer } from './service/server';
// import { useNavigate, useLocation } from 'react-router-dom';

// export const UserContext = createContext();

// function UserProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const navigate = useNavigate(); // ניתוב
//   const location = useLocation(); // בדיקת מיקום נוכחי
//   useEffect(() => {
//     if (!currentUser) {
//       const stored = localStorage.getItem('currentUserId');
//       let id = null;

//       try {
//         if (stored) {
//           id = JSON.parse(stored);
//         }
//       } catch (e) {
//         console.error('תוכן לא חוקי ב-localStorage:', stored);
//         localStorage.removeItem('currentUserId');

//         navigate('/', { replace: true });
//       }

//       if (id) {
//         const tryToLogin = async () => {
//           try {
//             const type = localStorage.getItem('type');
//             const usersResponse = await fetchServer(`/users/relogin`, { id, type }, 'POST');
//             if (usersResponse) {
//               console.log(usersResponse)
//               setCurrentUser(usersResponse);
//               if (location.pathname === '/') {
//                 // לנתב לדף הבית שלו
//                 navigate('/client-home');
//               }
//               //אם הוא בדף ה-/
//               // לנתב לדף הבית שלו
//             } else {
//               console.log('משתמש לא נמצא');
//               localStorage.removeItem('currentUserId');
//               navigate('/', { replace: true });
//             }
//           } catch (error) {
//             console.error('שגיאה בבדיקת התחברות:', error);
//             localStorage.removeItem('currentUserId');
//             navigate('/', { replace: true });
//           }
//         };
//         tryToLogin();
//       }
//     }
//   }, [currentUser]);

//   return (
//     <UserContext.Provider value={{ currentUser, setCurrentUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export default UserProvider;
import { useState, createContext, useEffect } from 'react';
import { fetchServer } from './service/server';
import { useNavigate, useLocation } from 'react-router-dom';

export const UserContext = createContext();

function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isCancelled = false; // ביטול במידה והקומפוננטה מתפרקת

    const stored = localStorage.getItem('currentUserId');
    if (!stored) return; // אין צורך להמשיך אם אין מזהה

    let id = null;
    try {
      id = JSON.parse(stored);
    } catch (e) {
      console.error('תוכן לא חוקי ב-localStorage:', stored);
      localStorage.removeItem('currentUserId');
      navigate('/', { replace: true });
      return;
    }

    if (!id) return;

    async function tryToLogin() {
      try {
        const type = localStorage.getItem('type');
        const usersResponse = await fetchServer(`/users/relogin`, { id, type }, 'POST');

        if (isCancelled) return; // עצור אם בוטל

        if (usersResponse) {
          setCurrentUser(usersResponse);
          console.log(usersResponse);
          if (location.pathname === '/') {
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
                navigate('/');
            }
          }
          
        } else {
          localStorage.removeItem('currentUserId');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('שגיאה בבדיקת התחברות:', error);
        localStorage.removeItem('currentUserId');
        if (!isCancelled) {
          navigate('/', { replace: true });
        }
      }
    }

    if (!currentUser) {
      tryToLogin();
    }

    return () => {
      isCancelled = true;
    };
  }, []); // תלות ריקה - רוץ רק פעם אחת בהתחלה

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;

