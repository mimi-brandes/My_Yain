import { useState, createContext, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import { fetchServer } from './service/server';

export const UserContext = createContext();

function UserProvider({ children }) {
     const [currentUser, setCurrentUser] = useState(null);
    // const navigate = useNavigate();
     // useEffect(() => {
     //      if (!currentUser) {
     //           const userId = JSON.parse(localStorage.getItem('currentUserId'));
     //           if (userId) {
     //                const tryToLogin = async (e) => {
     //                     const usersResponse = await fetchServer(`/users/${userId}`,'POST'); 
     //                     setCurrentUser(usersResponse);                       
     //                }
     //                tryToLogin();
     //           }
     //           //else
     //            //  navigate('/users/login'); 
     //      }
     // }, [currentUser]);
     useEffect(() => {
          if (!currentUser) {
            const userId = JSON.parse(localStorage.getItem('currentUserId'));
            if (userId) {
              const tryToLogin = async () => {
                try {
                  const usersResponse = await fetchServer(`/users/${userId}`, 'GET');
                  if (usersResponse) {
                    setCurrentUser(usersResponse);
                  } else {
                    console.log('משתמש לא נמצא');
                    localStorage.removeItem('currentUserId');
                  }
                } catch (error) {
                  console.error('שגיאה בבדיקת התחברות:', error);
                  localStorage.removeItem('currentUserId');
                }
              };
              tryToLogin();
            }
          }
        }, [currentUser]);
        
     return (
          <>
               <UserContext.Provider value={{ currentUser, setCurrentUser }}>
                    {children}
               </UserContext.Provider>
          </>
     );
}
export default UserProvider;
