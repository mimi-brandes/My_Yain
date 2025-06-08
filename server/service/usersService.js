const db = require('../db/connection');
// קבלת משתמש 
const getUser = (CustomerID,PasswordC,callback) => {
    // const sql = `
    // SELECT * FROM Customers
    // WHERE Customers.CustomerID =? AND Customers.PasswordC = ?`;
    // db.query(sql,[CustomerID,PasswordC], callback);
    const queries = [
        { table: 'Customers', idField: 'CustomerID', passwordField: 'PasswordC' },
        { table: 'Managers', idField: 'ManagerID', passwordField: 'PasswordM' },
        { table: 'Guides', idField: 'GuideID', passwordField: 'PasswordG' }
    ];

    const checkNext = (index) => {
        if (index >= queries.length) return callback(null, null); // לא נמצא באף טבלה
        const q = queries[index];
        const sql = `SELECT * FROM ${q.table} WHERE ${q.idField} = ? AND ${q.passwordField} = ?`;
        db.query(sql, [CustomerID, PasswordC], (err, results) => {
            if (err) return callback(err);
            if (results.length > 0) {
                const user = results[0];
                user.userType = q.table; // מוסיפים מאיזה טבלה
                return callback(null, user);
            } else {
                checkNext(index + 1);
            }
        });
    };

    checkNext(0);
};

// יצירת משתמש חדש
const createUser = (userData, callback) => {
    const { CustomerID, FullName, Email, Phone,Age,BirthDate } = userData;
    const sql = 'INSERT INTO Customers (CustomerID, FullName, Email, Phone,Age,BirthDate) VALUES(?,?,?,?)';
    db.query(sql, [CustomerID, FullName, Email, Phone,Age,BirthDate], callback);
};
// // עדכון משתמש
// const updateUser = (user_id, userData, callback) => {
//     const { user_name, user_email, adress, phone } = userData;
//     const sql = 'UPDATE users SET user_name=?, user_email=?, adress=?, phone=? WHERE user_id=?';
//     db.query(sql, [user_name, user_email, adress, phone, user_id], callback);
// };
// // מחיקת משתמש
// const deleteUser = (user_id, callback) => {
//     const sql = 'DELETE FROM users WHERE user_id=?';
//     db.query(sql, [user_id], callback);
// };

module.exports = {
    getUser,
    createUser
};
