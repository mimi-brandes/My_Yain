const db = require('../db/connection');
// כל היינות
const getAllWines = (callback) => {
  const sql = `
    SELECT wp.WineID, wp.WineName, wp.Price, wp.Quantity,
           wt.WineTypeID, wt.WineTypeName,
           img.ImageID, img.ImageURL
    FROM WineProducts wp
    JOIN WineTypes wt ON wp.WineTypeID = wt.WineTypeID
    JOIN Images img ON wp.ImageID = img.ImageID;
  `;
  db.query(sql, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

//כל המדריכים
const getAllGuides = (callback) => {
  const sql = `
  SELECT Id,Tz,FullName,Email,Password,Phone,WorkDays,StartHour,EndHour
  FROM Guides;
  `;
  db.query(sql, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};
//כל המנהלים
const getAllManagers = (callback) => {
  const sql = `
  SELECT Id,Tz,FullName,Email,Password,Phone
  FROM Managers;
  `;
  db.query(sql, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};
//כל הלקוחות
const getAllCustomers = (callback) => {
  const sql = `
  SELECT Id,Tz,FullName,Email,Password,Phone,Age,BirthDate
  FROM Customers;
  `;
  db.query(sql, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};
//כל הסיורים
const getAllTours = (callback) => {
  const sql = `
    SELECT 
      t.TourID, t.GroupSize, t.GroupName, t.TourHour, t.TourDate, t.Notes,
      c.Id AS CustomerID, c.FullName AS CustomerName,
      g.Id AS GuideID, g.FullName AS GuideName,
      tt.TourTypeID, tt.TourTypeName, tt.DescriptionT, tt.PricePerPerson,
      img.ImageURL, img.ImageID
    FROM Tours t
    JOIN Customers c ON t.CustomerID = c.Id
    JOIN Guides g ON t.GuideID = g.Id
    JOIN TourTypes tt ON t.TourTypeID = tt.TourTypeID
    JOIN Images img ON tt.ImageID = img.ImageID;
  `;
  db.query(sql, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};
//כל המכירות
const getAllSales = (callback) => {
  const sql = `
  SELECT s.SaleId,c.FullName,s.PurchaseDate,s.EndPrice
  FROM Sales s
  JOIN Customers c ON s.CustomerID = c.Id
  `;
  db.query(sql, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};
//כל המוצרים שנמכרו
const getAllProductsSold = (callback) => {
  const sql = `
  SELECT ps.ProductsSoldId,s.PurchaseDate,w.WineName,w.Quantity AS QuantityInStock,ps.Quantity AS SoldQuantity
  FROM ProductsSold ps
  JOIN Sales s ON ps.SoldId = s.SaleId
  JOIN WineProducts w ON ps.ProductId = w.WineID;
  `;
  db.query(sql, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};
//הוספת מנהל
const addManager = (managerData,callback) => {
  const { Tz, FullName, Email, Password, Phone} = managerData;
  const sql = `
  INSERT INTO Managers (Tz, FullName, Email, Password, Phone) VALUES (?, ?, ?, ?, ?);
  `;
  db.query(sql, [Tz, FullName, Email, Password, Phone],(err, results) => {
    if (err) return callback(err);
    callback(null, { id: Tz });
  });
};
//הוספת מדריך
const addGuide = (guideData,callback) => {
  const { Tz, FullName, Email, Password, Phone,WorkDays,StartHour,EndHour} = guideData;
  const sql = `
  INSERT INTO Guides (Tz, FullName, Email, Password, Phone,WorkDays,StartHour,EndHour) VALUES (?, ?, ?, ?, ?,?,?,?);
  `;
  db.query(sql, [Tz, FullName, Email, Password, Phone,WorkDays,StartHour,EndHour],(err, results) => {
    if (err) return callback(err);
    callback(null, { id: Tz });
  });
};
//עדכון יין
const updateWine = (wineID,wineData,callback) => {
  const { WineName, WineTypeID, ImageID, Quantity, Price} = wineData;
  const sql = 'UPDATE WineProducts SET WineName=?, WineTypeID=?, ImageID=?, Quantity=?,Price=? WHERE WineID=?';
  db.query(sql, [WineName, WineTypeID, ImageID, Quantity, Price, wineID], callback);
};
//עדכון מדריך
const updateGuide = (Id,guideData,callback) => {
  const { Tz, FullName, Email, Password, Phone,WorkDays,StartHour,EndHour} = guideData;
  const sql = 'UPDATE Guides SET Tz=?, FullName=?, Email=?, Password=?,Phone=?,WorkDays=?,StartHour=?,EndHour=? WHERE Id=?';
  db.query(sql, [Tz, FullName, Email, Password, Phone,WorkDays,StartHour,EndHour, Id], callback);
};
//עדכון מנהל
const updateManager = (Id,managerData,callback) => {
  const { Tz, FullName, Email, Password, Phone} = managerData;
  const sql = 'UPDATE Managers SET Tz=?, FullName=?, Email=?, Password=?,Phone=? WHERE Id=?';
  db.query(sql, [Tz, FullName, Email, Password, Phone, Id], callback);
};
//עדכון לקוח
const updateCustomer = (Id,customerData,callback) => {
  let  { Tz, FullName, Email, Password, Phone,Age,BirthDate} = customerData;
  if (BirthDate) {
    BirthDate = BirthDate.substring(0, 10); // חותך את התאריך ל-10 תווים ראשונים בלבד, לדוגמה: '1995-03-20'
  }
  const sql = 'UPDATE Customers SET Tz=?, FullName=?, Email=?, Password=?,Phone=?,Age=?,BirthDate=? WHERE Id=?';
  db.query(sql, [Tz, FullName, Email, Password, Phone,Age,BirthDate, Id], callback);
};
//עדכון סיור
const updateTour = (TourID, tourData, callback) => {
  const {
    GroupSize,
    GroupName,
    TourHour,
    TourDate,
    Notes,
    CustomerName,
    GuideName,
    TourTypeName
  } = tourData;
console.log(TourDate);
const cleanTourDate = TourDate ? new Date(TourDate).toISOString().slice(0, 10) : null;

  // תחילה - מקבלים את ה-IDs לפי השמות
  const getIdsSql = `
    SELECT 
      (SELECT Id FROM Customers WHERE FullName = ?) AS CustomerID,
      (SELECT Id FROM Guides WHERE FullName = ?) AS GuideID,
      (SELECT TourTypeID FROM TourTypes WHERE TourTypeName = ?) AS TourTypeID
  `;

  db.query(getIdsSql, [CustomerName, GuideName, TourTypeName], (err, results) => {
    if (err) return callback(err);

    if (!results || results.length === 0) return callback(new Error("לא נמצאו מזהים מתאימים"));

    const { CustomerID, GuideID, TourTypeID } = results[0];

    if (!CustomerID || !GuideID || !TourTypeID) {
      return callback(new Error("שם לקוח, מדריך או סוג סיור לא תקין"));
    }

    // עכשיו מבצעים עדכון עם ה-IDs שנמצאו
    const updateSql = `
      UPDATE Tours 
      SET GroupSize = ?, GroupName = ?, TourHour = ?, TourDate = ?, Notes = ?, CustomerID = ?, TourTypeID = ?, GuideID = ?
      WHERE TourID = ?
    `;
    db.query(
      updateSql,
      [GroupSize, GroupName, TourHour, cleanTourDate, Notes, CustomerID, TourTypeID, GuideID, TourID],
      callback
    );
  });
};
// מחיקת יין כולל מחיקת התמונה שלו
// const deleteWine = (wineID, callback) => {
//   const getImageIDSql = 'SELECT ImageID FROM WineProducts WHERE WineID = ?';

//   db.query(getImageIDSql, [wineID], (err, results) => {
//     if (err) return callback(err);
//     if (!results || results.length === 0) return callback(new Error("לא נמצא יין למחיקה"));

//     const imageID = results[0].ImageID;

//     const deleteWineSql = 'DELETE FROM WineProducts WHERE WineID = ?';
//     db.query(deleteWineSql, [wineID], (err) => {
//       if (err) return callback(err);

//       const deleteImageSql = 'DELETE FROM Images WHERE ImageID = ?';
//       db.query(deleteImageSql, [imageID], callback);
//     });
//   });
// };

// service
const deleteWine = (wineID, callback) => {
  const getImageIDSql = 'SELECT ImageID FROM WineProducts WHERE WineID = ?';

  // שלב 1: קודם מביאים את ImageID
  db.query(getImageIDSql, [wineID], (err, results) => {
    if (err) return callback(err);
    if (!results || results.length === 0) return callback(new Error("לא נמצא יין למחיקה"));

    const imageID = results[0].ImageID;

    // שלב 2: מוחקים קודם את היין
    const deleteWineSql = 'DELETE FROM WineProducts WHERE WineID = ?';
    db.query(deleteWineSql, [wineID], (err) => {
      if (err) return callback(err);

      // שלב 3: מוחקים את התמונה
      const deleteImageSql = 'DELETE FROM Images WHERE ImageID = ?';
      db.query(deleteImageSql, [imageID], (err2) => {
        if (err2) return callback(err2);
        callback(null); // הצלחה מלאה
      });
    });
  });
};

// מחיקת סיור
const deleteTour = (TourID, callback) => {
  const sql = 'DELETE FROM Tours WHERE TourID=?';
  db.query(sql, [TourID], callback);
};
// מחיקת מדריך
const deleteGuide = (Id, callback) => {
  const sql = 'DELETE FROM Guides WHERE Id=?';
  db.query(sql, [Id], callback);
};
// מחיקת מנהל
const deleteManager = (Id, callback) => {
  const sql = 'DELETE FROM Managers WHERE Id=?';
  db.query(sql, [Id], callback);
};
// מחיקת לקוח
const deleteCustomer = (Id, callback) => {
  const sql = 'DELETE FROM Customers WHERE Id=?';
  db.query(sql, [Id], callback);
};
module.exports = {
  getAllWines,
  getAllGuides,
  getAllManagers,
  getAllCustomers,
  getAllTours,
  getAllSales,
  getAllProductsSold,
  addManager,
  addGuide,
  updateWine,
  updateTour,
  updateGuide,
  updateManager,
  updateCustomer,
  deleteWine,
  deleteTour,
  deleteGuide,
  deleteManager,
  deleteCustomer
}