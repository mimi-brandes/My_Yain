const usersService = require('../service/usersService');
//הצגת משתמש
const getUser = (req, res) => {   
    const { CustomerID, PasswordC } = req.body;
    console.log("Login request body:", req.body);
    usersService.getUser(CustomerID, PasswordC, (err, user) => {
        if (err) return res.status(500).json({ error: err });
        if (!user) return res.status(401).json({ error: 'User not found' });
        res.json(user); // מחזיר את המשתמש כולל userType
    });
};
// const { CustomerID, PasswordC } = req.body;
    // usersService.getUser(CustomerID, PasswordC, (err, results) => {
    //     if (err) return res.status(500).json({ "error": err });
    //     res.json(results[0]);
    // });
//יצירת משתמש
const createUser = (req, res) => {
    usersService.createUser(req.body, (err) => {
        if (err) return res.status(500).json({ "error": err });
        res.status(201).json({ "message": 'המשתמש התווסף בהצלחה' });
    });
};
module.exports = {
    getUser,
    createUser
};
// //עדכון משתמש
// const updateUser = (req, res) => {
//     const user_id = req.params.user_id;
//     userModel.updateUser(user_id, req.body, (err) => {
//         if (err) return res.status(500).json({ "error": err });
//         res.status(201).json({ "message": 'המשתמש התעדכן בהצלחה' });
//     });
// };
// //מחיקת משתמש
// const deleteUser = (req, res) => {
//     const user_id = req.params.user_id;
//     userModel.deleteUser(user_id, (err) => {
//         if (err) return res.status(500).json({ "error": err });
//         res.status(201).json({ "message": 'המשתמש נמחק בהצלחה' });
//     });
// };

