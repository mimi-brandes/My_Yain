const db = require('../db/connection');

const getAllWineTypes = (callback) => {
  const sql = `
    SELECT WineTypes.WineTypeID, WineTypes.WineTypeName, Images.ImageURL 
    FROM WineTypes
    JOIN Images ON WineTypes.ImageID = Images.ImageID;
  `;
  db.query(sql, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

const getWinesByType = (wineTypeID, callback) => {
  const sql = `
    SELECT WineProducts.WineID, WineProducts.WineName, WineProducts.Price, Images.ImageURL, WineProducts.Quantity AS StockQuantity
    FROM WineProducts
    JOIN Images ON WineProducts.ImageID = Images.ImageID
    WHERE WineProducts.WineTypeID = ?
  `;
  db.query(sql, [wineTypeID], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

const getWinesByIDs = (ids, callback) => {
  const sql = `
    SELECT WineProducts.WineID, WineProducts.WineName, WineProducts.Price,
           Images.ImageURL
    FROM WineProducts
    JOIN Images ON WineProducts.ImageID = Images.ImageID
    WHERE WineProducts.WineID IN (?)
  `;
  db.query(sql, [ids], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

const createSale = (customerID, cartItems, endPrice, callback) => {
  const sqlSale = `INSERT INTO Sales (CustomerID, EndPrice) VALUES (?, ?)`;
  db.query(sqlSale, [customerID, endPrice], (err, result) => {
    if (err) return callback(err);
    const saleID = result.insertId;

    const values = cartItems.map(item => [saleID, item.productID, item.quantity]);
    const sqlItems = `INSERT INTO ProductsSold (SoldId, ProductId, Quantity) VALUES ?`;

    db.query(sqlItems, [values], (err2) => {
      if (err2) return callback(err2);

      // כאן נבצע עדכון של כמויות ב-WineProducts
      // עבור כל מוצר - נוריד מהכמות את הכמות שנמכרה
      const updateQueries = cartItems.map(item => {
        return new Promise((resolve, reject) => {
          const sqlUpdate = `
            UPDATE WineProducts
            SET Quantity = Quantity - ?
            WHERE WineID = ? AND Quantity >= ?
          `;
          db.query(sqlUpdate, [item.quantity, item.productID, item.quantity], (err3, result3) => {
            if (err3) return reject(err3);
            if (result3.affectedRows === 0) {
              // לא נמצא שורה עם כמות מספקת - אפשר לזרוק שגיאה או לטפל בזה
              return reject(new Error(`לא נמצאה כמות מספקת ליין עם מזהה ${item.productID}`));
            }
            resolve();
          });
        });
      });

      // מחכים שכל העדכונים יסתיימו
      Promise.all(updateQueries)
        .then(() => callback(null, saleID))
        .catch(errUpdate => callback(errUpdate));
    });
  });
};


const createWine = (wineName, price, quantity, wineTypeID, imageFile, callback) => {
  const sqlImage = `INSERT INTO Images (ImageURL) VALUES (?)`;
  db.query(sqlImage, [imageFile], (err, result) => {
    if (err) {
      console.error("❌ Error inserting into Images:", err);
      return callback(err);
    }

    const ImageID = result.insertId;

    const sqlItems = `INSERT INTO WineProducts (WineName, WineTypeID, ImageID, Quantity, Price) VALUES (?,?,?,?,?)`;
    db.query(sqlItems, [wineName, wineTypeID, ImageID, quantity, price], (err2, result2) => {
      if (err2) {
        console.error("❌ Error inserting into WineProducts:", err2);
        return callback(err2);
      }

      console.log("✅ Wine added with ID:", result2.insertId);
      callback(null, result2.insertId);
    });
  });
};
module.exports = {
  getAllWineTypes,
  getWinesByType,
  getWinesByIDs,
  createSale,
  createWine
};