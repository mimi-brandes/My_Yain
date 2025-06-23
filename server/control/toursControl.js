const toursService = require('../service/toursService');
const getAllTours = async (req, res) => {
  try {
    toursService.getAllTours((tours) => {
    res.json(tours);
    });
  } catch (err) {
    console.error('Error fetching tours:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// const bookTour = (req, res) => {
//   console.log("📥 הגיעה בקשה להזמנת סיור:", req.body);
//   toursService.bookTour(req.body, (err, newBooking) => {
//     if (err) {
//       console.error("❌ שגיאה בהזמנת סיור:", err);
//       return res.status(500).json({ error: "Failed to book tour." });
//     }
//     res.status(201).json(newBooking); // מחזירים את פרטי ההזמנה שנוצרה
//   });
// };
const bookTour = (req, res) => {
  console.log("📥 הגיעה בקשה להזמנת סיור:", req.body);

  toursService.bookTour(req.body, (err, newBooking) => {
    if (err) {
      console.warn("⚠️ שגיאה לוגית או מערכתית:", err);

      // אם השגיאה היא אובייקט שמכיל סוג (type), נעשה הבחנה
      if (typeof err === 'object' && err.type === 'logic') {
        return res.status(200).json({ error: err.message });
      }

      // שגיאה אמיתית – כמו שדות חסרים, SQL וכו'
      return res.status(400).json({ error: typeof err === 'string' ? err : 'שגיאה כללית בהזמנה' });
    }

    res.status(201).json(newBooking);
  });
};


const getToursByGuide = async (req, res) => {
  const guideID = req.params.Id;
  try {
    toursService.getToursByGuide(guideID, (err, tours) => {
      if (err) {
        console.error('Error fetching tours for guide:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(tours);
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

       const updateTourFeedback = async (req, res) => {
        try {
          toursService.updateTourFeedback(req.body, (err, data) => {
            if (err) {
              console.error('❌ שגיאה עידכון פידבאק :', err.message);
              return res.status(400).json({ error: err.message || 'שגיאה פנימית' });
            }
            res.json({ success: true, data });
          });
        } catch (err) {
          console.error('🛑 שגיאה כללית ב-Try של :', err.message);
          res.status(500).json({ error: 'שגיאה פנימית בשרת' });
        }
      };
module.exports = { getAllTours,bookTour,getToursByGuide,updateTourFeedback};
