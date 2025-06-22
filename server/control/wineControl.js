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
    const { ids } = req.body;
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

/** יצירת מכירה חדשה */
const createSale = async (req, res) => {
  try {
    const { customerID, cartItems, endPrice } = req.body;
    if (!customerID || !Array.isArray(cartItems) || cartItems.length === 0 || !endPrice) {
      return res.status(400).json({ error: 'Missing sale data' });
    }
    wineService.createSale(customerID, cartItems, endPrice, (err, result) => {
      if (err) {
        console.error('Error creating sale:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ message: 'Sale completed', saleID: result });
    });
  } catch (err) {
    console.error('Error in createSale:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// יצירת יין חדש
// const createWine = async (req, res) => {
//   try {
//     // const { wineName, price, quantity,wineTypeID,imageFile } = req.body;
//     const wineName = req.body.wineName;
//     const price = parseFloat(req.body.price);
//     const quantity = parseInt(req.body.quantity);
//     const wineTypeID = parseInt(req.body.wineTypeID);
//     const imageFile = req.body.imageFile;
//     console.log("BODY RECEIVED:", req.body);
//     wineService.createWine(wineName, price, quantity, wineTypeID, imageFile, (err, result) => {
//       if (err) {
//         console.error('Error creating wine:', err);
//         return res.status(500).json({ error: 'Internal server error' });
//       }
//       res.json({ message: 'wine completed', wineID: result });
//     });
//   } catch (err) {
//     console.error('Error in createWine:', err);
//     // res.status(500).json({ error: 'Internal server error' });
//   }
// };
const createWine = async (req, res) => {
  try {
    const wineName = req.body.wineName;
    const price = parseFloat(req.body.price);
    const quantity = parseInt(req.body.quantity);
    const wineTypeID = parseInt(req.body.wineTypeID);
    const imageFile = req.body.imageFile;

    console.log("BODY RECEIVED:", req.body);

    wineService.createWine(wineName, price, quantity, wineTypeID, imageFile, (err, wineID) => {
      if (err) {
        console.error('❌ Error creating wine:', err);
        return res.status(500).json({ ok: false, error: 'Internal server error' });
      }

      res.json({ ok: true, wineID, message: 'Wine added successfully' });
    });
  } catch (err) {
    console.error('❌ Error in createWine:', err);
    res.status(500).json({ ok: false, error: 'Unexpected error' });
  }
};

module.exports = {
  getAllWineTypes,
  getWinesByType,
  getWinesByIDs,
  createSale,
  createWine
};