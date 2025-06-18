const db = require('../db/connection');
// קבלת משתמש 
const getUser = (Tz, Password, callback) => {
    console.log("🔍 בודק משתמש עם ת", Tz, "וסיסמה:", Password);
    const queries = [
        { table: 'Customers', idField: 'Tz', passwordField: 'Password' },
        { table: 'Managers', idField: 'Tz', passwordField: 'Password' },
        { table: 'Guides', idField: 'Tz', passwordField: 'Password' }
    ];
    const checkNext = (index) => {
        if (index >= queries.length) return callback(null, null); // לא נמצא
        const q = queries[index];
        const sql = `SELECT * FROM ${q.table} WHERE ${q.idField} = ? AND ${q.passwordField} = ?`;
        db.query(sql, [Tz, Password], (err, results) => {
            if (err) {
                console.log("❌ שגיאה במסד נתונים:", err);
                return callback(err);
            }
            if (results.length > 0) {
                const user = results[0];
                user.userType = q.table;
                return callback(null, user);
            } else {
                checkNext(index + 1);
            }
        });
    };

    checkNext(0);
};

const getUserById = (id,type, callback) => {
    console.log("🔍 בודק משתמש עם ת", id,type);

    const sql = `SELECT * FROM Customers WHERE Id = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log("❌ שגיאה במסד נתונים:", err);
            return callback(err);
        }
        if (results.length > 0) {
            const user = results[0];
            user.userType ='customer';
            return callback(null, user);
        };


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
