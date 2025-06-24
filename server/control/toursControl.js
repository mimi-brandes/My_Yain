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

  toursService.bookTour(req.body, (err, newBooking) => {
    if (err) {
      console.warn("⚠️ שגיאה לוגית או מערכתית:", err);
      if (typeof err === 'object' && err.type === 'logic') {
        return res.status(200).json({ error: err.message });
      }
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
const addTourType = async (req, res) => {
  try {

    const TourTypeName = req.body.TourTypeName;
    const DescriptionT = req.body.DescriptionT;
    const PricePerPerson = parseFloat(req.body.PricePerPerson);
    const ImageURL = req.body.ImageURL;
    toursService.addTourType(TourTypeName, DescriptionT, PricePerPerson, ImageURL, (err, typeID) => {
      if (err) {
        console.error('❌ Error creating tour type:', err);
        return res.status(500).json({ ok: false, error: 'Internal server error' });
      }

      res.json({ ok: true, typeID, message: 'tour type added successfully' });
    });
  } catch (err) {
    console.error('❌ Error in createTourType:', err);
    res.status(500).json({ ok: false, error: 'Unexpected error' });
  }
};
module.exports = { getAllTours, bookTour, getToursByGuide, updateTourFeedback, addTourType };
