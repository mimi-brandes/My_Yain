const managerService = require('../service/managerService');
//כל היינות
const getAllWines = async (req, res) => {
    try {
        managerService.getAllWines((err, data) => {
        if (err) {
          console.error('Error fetching wines:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(data);
      });
    } catch (err) {
      console.error('Error fetching wines:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
//כל המדריכים
const getAllGuides = async (req, res) => {
    try {
        managerService.getAllGuides((err, data) => {
        if (err) {
          console.error('Error fetching guides:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(data);
      });
    } catch (err) {
      console.error('Error fetching guides:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  //כל המנהלים
  const getAllManagers = async (req, res) => {
    try {
        managerService.getAllManagers((err, data) => {
        if (err) {
          console.error('Error fetching managers:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(data);
      });
    } catch (err) {
      console.error('Error fetching managers:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
    //כל הלקוחות
    const getAllCustomers = async (req, res) => {
        try {
            managerService.getAllCustomers((err, data) => {
            if (err) {
              console.error('Error fetching customers:', err);
              return res.status(500).json({ error: 'Internal server error' });
            }
            res.json(data);
          });
        } catch (err) {
          console.error('Error fetching customers:', err);
          res.status(500).json({ error: 'Internal server error' });
        }
      };
    //כל הסיורים
    const getAllTours = async (req, res) => {
        try {
            managerService.getAllTours((err, data) => {
            if (err) {
              console.error('Error fetching tours:', err);
              return res.status(500).json({ error: 'Internal server error' });
            }
            res.json(data);
          });
        } catch (err) {
          console.error('Error fetching tours:', err);
          res.status(500).json({ error: 'Internal server error' });
        }
      };
    //כל המכירות
    const getAllSales = async (req, res) => {
        try {
            managerService.getAllSales((err, data) => {
            if (err) {
              console.error('Error fetching sales:', err);
              return res.status(500).json({ error: 'Internal server error' });
            }
            res.json(data);
          });
        } catch (err) {
          console.error('Error fetching sales:', err);
          res.status(500).json({ error: 'Internal server error' });
        }
      };
    //כל הפריטים שנמכרו
    const getAllProductsSold = async (req, res) => {
        try {
            managerService.getAllProductsSold((err, data) => {
            if (err) {
              console.error('Error fetching products-sold:', err);
              return res.status(500).json({ error: 'Internal server error' });
            }
            res.json(data);
          });
        } catch (err) {
          console.error('Error fetching products-sold:', err);
          res.status(500).json({ error: 'Internal server error' });
        }
      };

//     // הוספת מנהל
// const addManager = async (req, res) => {
//     try {
//       console.log("📥 בקשת הרשמה של מנהל:", req.body);  // מדפיס את מה שנשלח
  
//       managerService.addManager(req.body, (err, data) => {
//         if (err) {
//           if (err.code === 'ER_DUP_ENTRY') {
//             console.error('⚠️ מייל כבר קיים:', req.body.Email);
//             return res.status(400).json({ error: 'המייל כבר קיים במערכת' });
//           }
  
//           console.error('❌ שגיאה בהרשמה למנהל:', err.message);
//           console.error('📄 כל פרטי השגיאה:', err); // מדפיס הכל למקרה שיש מידע נוסף
//           return res.status(500).json({ error: 'שגיאה פנימית בשרת' });
//         }
  
//         console.log("✅ מנהל נוסף בהצלחה:", data);
//         res.json(data);
//       });
//     } catch (err) {
//       console.error('🛑 שגיאה כללית ב-Try של addManager:', err.message);
//       res.status(500).json({ error: 'שגיאה פנימית בשרת' });
//     }
//   };
//     const addGuide = async (req, res) => {
//         try {
//           console.log("📥 בקשת הרשמה של מדריך:", req.body);
      
//           managerService.addGuide(req.body, (err, data) => {
//             if (err) {
//               if (err.code === 'ER_DUP_ENTRY') {
//                 console.error('⚠️ מייל כבר קיים:', req.body.Email);
//                 return res.status(400).json({ error: 'המייל כבר קיים במערכת' });
//               }
      
//               console.error('❌ שגיאה בהרשמה למדריך:', err.message);
//               console.error('📄 כל פרטי השגיאה:', err);
//               return res.status(500).json({ error: 'שגיאה פנימית בשרת' });
//             }
      
//             console.log("✅ מדריך נוסף בהצלחה:", data);
//             res.json(data);
//           });
//         } catch (err) {
//           console.error('🛑 שגיאה כללית ב-Try של addGuide:', err.message);
//           res.status(500).json({ error: 'שגיאה פנימית בשרת' });
//         }
//       };
const addManager = async (req, res) => {
    try {
      console.log("📥 בקשת הרשמה של מנהל:", req.body);
      managerService.addManager(req.body, (err, data) => {
        if (err) {
          console.error('❌ שגיאה בהרשמה למנהל:', err.message);
          return res.status(400).json({ error: err.message || 'שגיאה פנימית' });
        }
        console.log("✅ מנהל נוסף בהצלחה:", data);
        res.json(data);
      });
    } catch (err) {
      console.error('🛑 שגיאה כללית ב-Try של addManager:', err.message);
      res.status(500).json({ error: 'שגיאה פנימית בשרת' });
    }
  };
  
  const addGuide = async (req, res) => {
    try {
      console.log("📥 בקשת הרשמה של מדריך:", req.body);
      managerService.addGuide(req.body, (err, data) => {
        if (err) {
          console.error('❌ שגיאה בהרשמה למדריך:', err.message);
          return res.status(400).json({ error: err.message || 'שגיאה פנימית' });
        }
        console.log("✅ מדריך נוסף בהצלחה:", data);
        res.json(data);
      });
    } catch (err) {
      console.error('🛑 שגיאה כללית ב-Try של addGuide:', err.message);
      res.status(500).json({ error: 'שגיאה פנימית בשרת' });
    }
  };
  //עדכון יין
  const updateWine = async (req, res) => {
    try {
        const wineID = req.body.WineID;
    managerService.updateWine(wineID,req.body, (err, data) => {
        if (err) {
          console.error('❌ שגיאה בעידכון יין :', err.message);
          return res.status(400).json({ error: err.message || 'שגיאה פנימית' });
        }
        res.json({ success: true, data });
      });
    } catch (err) {
      console.error('🛑 שגיאה כללית ב-Try של addGuide:', err.message);
      res.status(500).json({ error: 'שגיאה פנימית בשרת' });
    }
  };
    //עדכון מדריך
    const updateGuide = async (req, res) => {
        try {
        const Id = req.body.Id;
        managerService.updateGuide(Id,req.body, (err, data) => {
            if (err) {
              console.error('❌ שגיאה בעידכון מדריך :', err.message);
              return res.status(400).json({ error: err.message || 'שגיאה פנימית' });
            }
            res.json({ success: true, data });
          });
        } catch (err) {
          console.error('🛑 שגיאה כללית ב-Try של :', err.message);
          res.status(500).json({ error: 'שגיאה פנימית בשרת' });
        }
      };
       //עדכון מנהל
    const updateManager = async (req, res) => {
        try {
        const Id = req.body.Id;
        managerService.updateManager(Id,req.body, (err, data) => {
            if (err) {
              console.error('❌ שגיאה בעידכון מנהל :', err.message);
              return res.status(400).json({ error: err.message || 'שגיאה פנימית' });
            }
            res.json({ success: true, data });
          });
        } catch (err) {
          console.error('🛑 שגיאה כללית ב-Try של :', err.message);
          res.status(500).json({ error: 'שגיאה פנימית בשרת' });
        }
      };
           //עדכון לקוח
    const updateCustomer = async (req, res) => {
        try {
        const Id = req.body.Id;
        managerService.updateCustomer(Id,req.body, (err, data) => {
            if (err) {
              console.error('❌ שגיאה בעידכון לקוח :', err.message);
              return res.status(400).json({ error: err.message || 'שגיאה פנימית' });
            }
            res.json({ success: true, data });
          });
        } catch (err) {
          console.error('🛑 שגיאה כללית ב-Try של :', err.message);
          res.status(500).json({ error: 'שגיאה פנימית בשרת' });
        }
      };
    //עדכון סיור
    const updateTour = async (req, res) => {
        try {
        const TourID = req.body.TourID;
        managerService.updateTour(TourID,req.body, (err, data) => {
            if (err) {
              console.error('❌ שגיאה בעידכון סיור :', err.message);
              return res.status(400).json({ error: err.message || 'שגיאה פנימית' });
            }
            res.json({ success: true, data });
          });
        } catch (err) {
          console.error('🛑 שגיאה כללית ב-Try של addGuide:', err.message);
          res.status(500).json({ error: 'שגיאה פנימית בשרת' });
        }
      };
      //מחיקת יין
const deleteWine = (req, res) => {
    const wineID = req.body.wineID;
    managerService.deleteWine(wineID, (err) => {
      if (err) {
        console.error("❌ שגיאה במחיקת יין:", err); 
        return res.status(500).json({ error: err });
      }
      res.status(201).json({ success: true, message: 'היין נמחק בהצלחה' });
    });
  };
  
      //מחיקת סיור
      const deleteTour = (req, res) => {
        const TourID = req.body.TourID;
        managerService.deleteTour(TourID, (err) => {
            if (err) return res.status(500).json({ "error": err });
            res.status(201).json({ success: true, message: 'הסיור נמחק בהצלחה' });
        });
    };
          //מחיקת מדריך
const deleteGuide = (req, res) => {
    const Id = req.body.Id;
    managerService.deleteGuide(Id, (err) => {
        if (err) return res.status(500).json({ "error": err });
        res.status(201).json({ success: true, message: 'המדריך נמחק בהצלחה' });
    });
};
      //מחיקת מנהל
      const deleteManager = (req, res) => {
        const Id = req.body.Id;
        managerService.deleteManager(Id, (err) => {
            if (err) return res.status(500).json({ "error": err });
            res.status(201).json({ success: true, message: 'המנהל נמחק בהצלחה' });
        });
    };
          //מחיקת לקוח
const deleteCustomer = (req, res) => {
    const Id = req.body.Id;
    managerService.deleteCustomer(Id, (err) => {
        if (err) return res.status(500).json({ "error": err });
        res.status(201).json({ success: true, message: 'הלקוח נמחק בהצלחה' });
    });
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
  };