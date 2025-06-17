const express = require('express');
const router = express.Router();
const wineControl = require('../control/wineControl');
router.get('/', wineControl.getAllWineTypes);
router.get('/:wineTypeID', wineControl.getWinesByType);
module.exports = router;