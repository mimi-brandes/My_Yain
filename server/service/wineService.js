const db = require('../db/connection');

// שליפת כל סוגי היינות עם תמונה
const getAllWineTypes = (callback) => {
  const sql = `
    SELECT WineTypes.WineTypeID, WineTypes.WineTypeName, Images.ImageURL 
    FROM WineTypes
    JOIN Images ON WineTypes.ImageID = Images.ImageID;
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("🚨 שגיאה בשליפת סוגי יין:", err.message);
      return callback(err);
    }
    callback(results);
  });
};
// יינות לפי סוג יין
const getWinesByType = (wineTypeID, callback) => {
  const sql = `
    SELECT Wines.WineID, Wines.WineName, Wines.Price, Images.ImageURL, Wines.StockQuantity
    FROM Wines
    JOIN Images ON Wines.ImageID = Images.ImageID
    WHERE Wines.WineTypeID = ?
  `;
  db.query(sql, [wineTypeID], (err, results) => {
    if (err) {
      console.error("🚨 שגיאה בשליפת יינות לפי סוג:", err.message);
      return callback(err);
    }
    callback(results);
  });
};
module.exports = {
  getAllWineTypes,
  getWinesByType
};
