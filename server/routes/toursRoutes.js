const express = require('express');
const router = express.Router();
const toursControl = require('../control/toursControl');

router.get('/', toursControl.getAllTours);
router.post('/book', toursControl.bookTour); 
router.get('/guide/:Id', toursControl.getToursByGuide);
router.post('/update-feedback', toursControl.updateTourFeedback);


module.exports = router;
