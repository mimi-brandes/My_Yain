//חיבור למסד הנתונים
const mysql = require('mysql2');
require('dotenv').config();
//יצירת החיבור
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
//בדיקה אם התחבר או לא
connection.connect((err) => {
  if (err) {
    console.error('שגיאה בחיבור למסד הנתונים:', err);
    return;
  }
  console.log('התחברת בהצלחה ל-MySQL!');
});
module.exports = connection;
