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

  // 🔍 בדיקת נתונים חסרים
  if (!groupSize || !groupName || !tourHour || !tourDate || !TourTypeID || !CustomerID) {
    console.error("❌ נתונים חסרים:", { groupSize, groupName, tourHour, tourDate, TourTypeID, CustomerID });
    return callback('נתונים חסרים בהזמנה'); // שגיאה אמיתית → תוחזר עם status 400
  }

  // 🧭 שלב 1: קריאה לפרוצדורה שמחזירה מדריך פנוי
  db.query(`CALL AssignGuideForTour(?, ?, @out_GuideID, @out_error);`, [tourDate, tourHour], (err1) => {
    if (err1) {
      console.error("❌ שגיאה בפרוצדורה AssignGuideForTour:", err1);
      return callback('שגיאה בפרוצדורה AssignGuideForTour'); // שגיאה אמיתית
    }

    // 🧾 שלב 2: שליפת משתני הפלט
    db.query(`SELECT @out_GuideID AS GuideID, @out_error AS Err;`, (err2, result) => {
      if (err2) {
        console.error("❌ שגיאה בשליפת הפלט מהפרוצדורה:", err2);
        return callback('שגיאה בשליפת הפלט מהפרוצדורה'); // שגיאה אמיתית
      }

      const out = result?.[0];

      if (!out) {
        console.error("⚠️ לא התקבלה תשובה מהפרוצדורה AssignGuideForTour");
        return callback('שגיאה פנימית: לא התקבלה תשובה מהפרוצדורה'); // שגיאה אמיתית
      }

      if (out.Err) {
        console.warn("⚠️ שגיאת מדריך:", out.Err);
        return callback({ type: 'logic', message: out.Err }); // ⚠️ שגיאה לוגית – תוחזר עם status 200
      }

      const GuideID = out.GuideID;

      if (!GuideID) {
        console.error("❌ GuideID ריק למרות שאין שגיאה בפרוצדורה");
        return callback('שגיאה פנימית: לא נבחר מדריך למרות שאין שגיאה בפרוצדורה'); // שגיאה אמיתית
      }

      console.log("🧭 מדריך שנבחר:", GuideID);

      // ✅ שלב 3: הכנסת ההזמנה לטבלת Tours
      const sqlInsert = `
        INSERT INTO Tours 
        (groupSize, groupName, tourHour, tourDate, notes, TourTypeID, CustomerID, GuideID) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `;

      db.query(
        sqlInsert,
        [groupSize, groupName, tourHour, tourDate, notes, TourTypeID, CustomerID, GuideID],
        (err3, resultInsert) => {
          if (err3) {
            console.error("❌ שגיאה בהזמנת סיור:", err3.message, err3.sqlMessage);
            return callback('שגיאה בהזמנת סיור. אנא נסה שוב מאוחר יותר.'); // שגיאה אמיתית
          }

          callback(null, {
            bookingId: resultInsert.insertId,
            message: "✅ הסיור הוזמן בהצלחה!"
          });
        }
      );
    });
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
const updateTourFeedback = (data, callback) => {
  const {TourID,GuideFeedback  } = data;
      const sql = `
        UPDATE Tours SET GuideFeedback=? WHERE TourID=?
      `;
      db.query(sql,[GuideFeedback,TourID ],callback);
    } ;
    const addTourType = (TourTypeName,DescriptionT,PricePerPerson, ImageURL, callback) => {
      const sqlImage = `INSERT INTO Images (ImageURL) VALUES (?)`;
      db.query(sqlImage, [ImageURL], (err, result) => {
        if (err) {
          console.error("❌ Error inserting into Images:", err);
          return callback(err);
        }
        const ImageID = result.insertId;
        const sqlItems = `INSERT INTO tourtypes (TourTypeName,DescriptionT,PricePerPerson, ImageID) VALUES (?,?,?,?)`;
        db.query(sqlItems, [TourTypeName,DescriptionT,PricePerPerson,ImageID], (err2, result2) => {
          if (err2) {
            console.error("❌ Error inserting into tourtypes:", err2);
            return callback(err2);
          }
          callback(null, result2.insertId);
        });
      });
    };
module.exports = { getAllTours, bookTour,getToursByGuide,updateTourFeedback,addTourType };
