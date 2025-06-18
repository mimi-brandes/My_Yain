const wineService = require('../service/wineService');
/** כל סוגי היין */
const getAllWineTypes = async (req, res) => {
  try {
    wineService.getAllWineTypes((err, data) => {
      if (err) {
        console.error('Error fetching wine types:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(data);
    });
  } catch (err) {
    console.error('Error fetching wine types:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** כל היינות תחת סוג מסוים */
const getWinesByType = async (req, res) => {
  try {
    const { wineTypeID } = req.params;
    wineService.getWinesByType(wineTypeID, (err, data) => {
      if (err) {
        console.error('Error fetching wines by type:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(data);
    });
  } catch (err) {
    console.error('Error fetching wines by type:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** שליפת פרטי יינות לפי מערך IDs (לסל) */
const getWinesByIDs = async (req, res) => {
  try {
    const { ids } = req.body;        // צפי: { ids:[1,2,3] }
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'ids array required' });
    }
    wineService.getWinesByIDs(ids, (err, data) => {
      if (err) {
        console.error('Error fetching wines by ids:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(data);
    });
  } catch (err) {
    console.error('Error fetching wines by ids:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllWineTypes,
  getWinesByType,
  getWinesByIDs
};
