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
      return callback("שגיאה בבחירת מדריך");
    }

    const out = results[1][0]; // התוצאה של SELECT @out_GuideID, @out_error

    if (out.Err) {
      console.error("⚠️ שגיאת מדריך:", out.Err);
      return callback(out.Err); // אם לא נמצא מדריך פנוי
    }

    const GuideID = out.GuideID; // כעת GuideID מוגדר
    console.log("🧭 מדריך שנבחר:", GuideID);

    // רק עכשיו נרשום את הלוג עם GuideID
    console.log("💾 פרטי ההזמנה לפני SQL:", { groupSize, groupName, tourHour, tourDate, notes, TourTypeID, CustomerID, GuideID });

    // הכנסת ההזמנה לטבלת Tours
    const sqlInsert = `
      INSERT INTO Tours 
      (groupSize, groupName, tourHour, tourDate, notes, TourTypeID, CustomerID, GuideID) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

    db.query(
      sqlInsert,
      [groupSize, groupName, tourHour, tourDate, notes, TourTypeID, CustomerID, GuideID],
      (err, result) => {
        if (err) {
          console.error("❌ שגיאה בהזמנת סיור:", err.message, err.sqlMessage, err.sql);
          return callback("שגיאה בהזמנת סיור");
        }

        // הצלחה!
        callback(null, {
          bookingId: result.insertId,
          message: "✅ הסיור הוזמן בהצלחה!"
        });
      }
    );
  });
};

module.exports = { getAllTours, bookTour };
