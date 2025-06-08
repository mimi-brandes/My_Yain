const db = require('./db/connection');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors())

// const users=require('./routes/userRoutes');
const path = require('path');
const userRoutes = require(path.join(__dirname, 'routes', 'usersRoutes'));
console.log('DB_USER:', process.env.DB_USER);

// נתיב בדיקה
app.get('/', (req, res) => {
  res.send('השרת עובד והחיבור למסד הצליח!');
});
app.use("/users",userRoutes);

// הפעלת השרת
app.listen(port, () => {
  console.log(`השרת רץ על פורט ${port}`);
});