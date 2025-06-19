const express = require('express');
const router = express.Router();
const wineControl = require('../control/wineControl');

router.get('/',               wineControl.getAllWineTypes);
router.get('/:wineTypeID',    wineControl.getWinesByType);
router.post('/by-ids',        wineControl.getWinesByIDs);   
router.post('/sale',          wineControl.createSale);

module.exports = router;
