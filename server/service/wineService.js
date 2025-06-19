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
      callback(null, saleID);
    });
  });
};

module.exports = {
  getAllWineTypes,
  getWinesByType,
  getWinesByIDs,
  createSale
};