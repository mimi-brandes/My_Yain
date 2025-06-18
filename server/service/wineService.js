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

module.exports = {
  getAllWineTypes,
  getWinesByType,
  getWinesByIDs
};
