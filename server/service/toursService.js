// const db = require('../db/connection');

// // שליפת כל סוגי הסיורים עם תמונה
// const getAllTours = (callback) => {
//   const sql = `
//     SELECT TourTypes.*, Images.ImageURL 
//     FROM TourTypes
//     JOIN Images ON TourTypes.ImageID = Images.ImageID;
//   `;
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("🚨 שגיאה בשליפת סיורים:", err.message);
//       return callback(err);
//     }
//     callback(results);
//   });
// };

// // הזמנת סיור
// const bookTour = (data, callback) => {
//   const { groupSize, groupName, tourHour, tourDate, notes, TourTypeID, CustomerID } = data;

//   // בדיקת נתונים חסרים
//   if (!groupSize || !groupName || !tourHour || !tourDate || !TourTypeID || !CustomerID) {
//     console.error("❌ נתונים חסרים:", { groupSize, groupName, tourHour, tourDate, TourTypeID, CustomerID });
//     return callback("נתונים חסרים בהזמנה");
//   }

//   // קריאה לפרוצדורה שמחזירה מדריך פנוי
//   const procCall = `
//     CALL AssignGuideForTour(?, ?, @out_GuideID, @out_error);
//     SELECT @out_GuideID AS GuideID, @out_error AS Err;
//   `;

//   db.query(procCall, [tourDate, tourHour], (err, results) => {
//     if (err) {
//       console.error("❌ שגיאה בבחירת מדריך:", err);
//       return callback("שגיאה בבחירת מדריך");
//     }

//     const out = results[1][0]; // התוצאה של SELECT @out_GuideID, @out_error

//     if (out.Err) {
//       console.error("⚠️ שגיאת מדריך:", out.Err);
//       return callback(out.Err); // אם לא נמצא מדריך פנוי
//     }

//     const GuideID = out.GuideID; // כעת GuideID מוגדר

//     // הכנסת ההזמנה לטבלת Tours
//     const sqlInsert = `
//       INSERT INTO Tours 
//       (groupSize, groupName, tourHour, tourDate, notes, TourTypeID, CustomerID, GuideID) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?);
//     `;

//     db.query(
//       sqlInsert,
//       [groupSize, groupName, tourHour, tourDate, notes, TourTypeID, CustomerID, GuideID],
//       (err, result) => {
//         if (err) {
//           console.error("❌ שגיאה בהזמנת סיור:", err.message, err.sqlMessage, err.sql);
//           return callback("שגיאה בהזמנת סיור");
//         }

//         // הצלחה!
//         callback(null, {
//           bookingId: result.insertId,
//           message: "✅ הסיור הוזמן בהצלחה!"
//         });
//       }
//     );
//   });
// };

// module.exports = { getAllTours, bookTour };
// service/tourService.js
const db = require('../db/connection');

// שליפת כל סוגי הסיורים עם תמונה
const getAllTours = (callback) => {
  const sql = `
    SELECT TourTypes.*, Images.ImageURL 
    FROM TourTypes
    JOIN Images ON TourTypes.ImageID = Images.ImageID;
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("🚨 שגיאה בשליפת סיורים:", err.message);
      return callback(err);
    }
    callback(results);
  });
};

// הזמנת סיור
const bookTour = (data, callback) => {
  const { groupSize, groupName, tourHour, tourDate, notes, TourTypeID, CustomerID } = data;

  console.log("📥 Starting booking with data:", data);

  // בדיקת נתונים חסרים
  if (!groupSize || !groupName || !tourHour || !tourDate || !TourTypeID || !CustomerID) {
    console.error("❌ נתונים חסרים:", { groupSize, groupName, tourHour, tourDate, TourTypeID, CustomerID });
    return callback("נתונים חסרים בהזמנה");
  }

  // קריאה לפרוצדורה שמחזירה מדריך פנוי
  const procCall = `
    CALL AssignGuideForTour(?, ?, @out_GuideID, @out_error);
    SELECT @out_GuideID AS GuideID, @out_error AS Err;
  `;

  db.query(procCall, [tourDate, tourHour], (err, results) => {
    if (err) {
      console.error("❌ שגיאה בבחירת מדריך:", err);
      return callback("שגיאה בבחירת מדריך. ודא שהפרוצדורה קיימת ופועלת כראוי.");
    }

    try {
      const out = results[1]?.[0];

      if (!out) {
        console.error("⚠️ לא התקבלה תשובה מהפרוצדורה AssignGuideForTour");
        return callback("שגיאה פנימית: לא התקבלה תשובה מהפרוצדורה");
      }

      if (out.Err) {
        console.error("⚠️ שגיאת מדריך:", out.Err);
        return callback(out.Err);
      }

      const GuideID = out.GuideID;
      if (!GuideID) {
        console.error("❌ GuideID ריק למרות שאין שגיאה בפרוצדורה");
        return callback("שגיאה פנימית: לא נבחר מדריך למרות שאין שגיאה בפרוצדורה");
      }

      console.log("🧭 מדריך שנבחר:", GuideID);

      // הכנסת ההזמנה לטבלת Tours
      const sqlInsert = `
        INSERT INTO Tours 
        (groupSize, groupName, tourHour, tourDate, notes, TourTypeID, CustomerID, GuideID) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `;

      db.query(
        sqlInsert,
        [groupSize, groupName, tourHour, tourDate, notes, TourTypeID, CustomerID, GuideID],
        (err2, result) => {
          if (err2) {
            console.error("❌ שגיאה בהזמנת סיור:", err2.message, err2.sqlMessage);
            return callback("שגיאה בהזמנת סיור. אנא נסה שוב מאוחר יותר.");
          }

          callback(null, {
            bookingId: result.insertId,
            message: "✅ הסיור הוזמן בהצלחה!"
          });
        }
      );
    } catch (e) {
      console.error("❌ חריגה בעת עיבוד תוצאת הפרוצדורה:", e);
      return callback("שגיאה פנימית בעת עיבוד התוצאה מהפרוצדורה");
    }
  });
};
const getToursByGuide = (guideID, callback) => {
  const sql = `
  SELECT Tours.*, TourTypes.TourTypeName, Images.ImageURL
  FROM Tours
  JOIN TourTypes ON Tours.TourTypeID = TourTypes.TourTypeID
  JOIN Images ON TourTypes.ImageID = Images.ImageID
  WHERE GuideID = ?;
`;

  db.query(sql, [guideID], (err, results) => {
    if (err) {
      console.error("❌ שגיאה בשליפת סיורים למדריך:", err.message);
      return callback(err);
    }
    callback(null, results);
  });
};
module.exports = { getAllTours, bookTour,getToursByGuide };
