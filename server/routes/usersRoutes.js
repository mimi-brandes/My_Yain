const express = require('express'); //לייבא את express
const router = express.Router(); // לייצר אפליקציה
const usersControl = require('../control/usersControl');

router.post('/', usersControl.createUser);

router.post('/login', usersControl.getUser);
router.post('/relogin', usersControl.getUserById);

module.exports = router;