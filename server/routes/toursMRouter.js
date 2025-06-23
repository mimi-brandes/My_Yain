const express = require('express');
const router = express.Router();
const managerControl = require('../control/managerControl');
//הבאת כל היינות

//הבאת כל הסיורים
router.get('/tours',          managerControl.getAllTours);

//עדכון סיור
router.post('/tours/update',          managerControl.updateTour);
//עדכון מדריך

router.post('/tours/delete',          managerControl.deleteTour);
//מחיקת מדריך

module.exports = router;