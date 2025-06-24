const db = require('./db/connection');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors())
app.use(express.static('public'));


const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'public/images')));
const userRoutes = require(path.join(__dirname, 'routes', 'usersRoutes'));
const toursRoutes = require('./routes/toursRoutes');
const wineRoutes = require('./routes/wineRoutes');
const managerRoutes = require('./routes/managerRoutes');

// נתיב בדיקה
app.get('/', (req, res) => {
  res.send('השרת עובד והחיבור למסד הצליח!');
});


app.use("/users",userRoutes);
app.use('/tours', toursRoutes);
app.use('/wines', wineRoutes);
app.use('/managers', managerRoutes);


// הפעלת השרת
app.listen(port, () => {
  console.log(`השרת רץ על פורט ${port}`);
});