const db = require('../db/connection');
// קבלת משתמש 
const getUser = (Tz, Password, callback) => {
    const sql = `SELECT * FROM AllUsers WHERE Tz = ? AND Password = ? LIMIT 1`;
  
    db.query(sql, [Tz, Password], (err, results) => {
      if (err) {
        console.error("❌ שגיאה במסד הנתונים:", err);
        return callback(err);
      }
  
      if (results.length > 0) {
        return callback(null, results[0]); // כולל userType
      } else {
        return callback(null, null); // לא נמצא
      }
    });
  };

  const getUserById = (id,type,callback) => {
    const sql = `SELECT * FROM AllUsers WHERE Id = ? and userType COLLATE utf8mb4_0900_ai_ci = ? LIMIT 1`;
    db.query(sql, [id,type], (err, results) => {
      if (err) {
        console.error("❌ שגיאה במסד נתונים:", err);
        return callback(err);
      }
  
      if (results.length > 0) {
        const user = results[0]; // כולל userType
        return callback(null, user);
      } else {
        return callback(null, null); // לא נמצא
      }
    });
  };
  

// יצירת משתמש חדש
const createUser = (userData, callback) => {
    const { Tz, FullName, Email, Password, Phone, Age, BirthDate } = userData;
    const sql = 'INSERT INTO Customers (Tz, FullName, Email, Password, Phone, Age, BirthDate) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [Tz, FullName, Email, Password, Phone, Age, BirthDate], (err, result) => {
        if (err) return callback(err);
        callback(null, { id: Tz });
    });

};

module.exports = {
    getUser,
    createUser,
    getUserById
};
