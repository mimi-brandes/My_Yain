const wineService = require('../service/wineService');

const getAllWineTypes = async (req, res) => {
  try {
    wineService.getAllWineTypes((data) => {
      res.json(data);
    });
  } catch (err) {
    console.error('Error fetching wine types:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getWinesByType = async (req, res) => {
  try {
    const { wineTypeID } = req.params;
    wineService.getWinesByType(wineTypeID, (data) => {
      res.json(data);
    });
  } catch (err) {
    console.error('Error fetching wines by type:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllWineTypes,
  getWinesByType
};
