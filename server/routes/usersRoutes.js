const express = require('express'); //לייבא את express
const router = express.Router(); // לייצר אפליקציה
const usersControl = require('../control/usersControl');
// קריאת כל המשתמשים
router.post('/login', usersControl.getUser);
// יצירת משתמש חדש
router.post('/', usersControl.createUser);
// // עדכון משתמש קיים לפי מזהה
// router.put('/:user_id', usersController.updateUser);
// // מחיקת משתמש לפי מזהה
// router.delete('/:user_id', usersController.deleteUser);
module.exports = router;