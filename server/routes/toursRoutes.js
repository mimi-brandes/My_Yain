const express = require('express');
const router = express.Router();
const toursControl = require('../control/toursControl');

router.get('/', toursControl.getAllTours);
router.post('/book', toursControl.bookTour); // נתיב חדש להזמנת סיור
module.exports = router;
