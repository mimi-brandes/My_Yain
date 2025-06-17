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
const bookTour = (req, res) => {
  console.log("📥 הגיעה בקשה להזמנת סיור:", req.body);
  toursService.bookTour(req.body, (err, newBooking) => {
    if (err) {
      console.error("❌ שגיאה בהזמנת סיור:", err);
      return res.status(500).json({ error: "Failed to book tour." });
    }
    res.status(201).json(newBooking); // מחזירים את פרטי ההזמנה שנוצרה
  });
};
module.exports = { getAllTours,bookTour };
