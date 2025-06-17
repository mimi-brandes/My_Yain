const usersService = require('../service/usersService');
//הצגת משתמש
const getUser = (req, res) => {   
    console.log("📥 הגיע בקשת התחברות:", req.body);
    const { Tz, Password } = req.body;
    console.log("Login request body:", req.body);
    usersService.getUser(Tz, Password, (err, user) => {
        if (err) return res.status(500).json({ error: err });
        if (!user) return res.status(401).json({ error: 'User not found' });
        res.json(user); // מחזיר את המשתמש כולל userType
    });
};
const getUserById = (req, res) => {   
    console.log("📥 הגיע בקשת התחברות:", req.body);
    const { id,type } = req.body;
    console.log("Login request body:", req.body);
    usersService.getUserById(id,type, (err, user) => {
        if (err) return res.status(500).json({ error: err });
        if (!user) return res.status(401).json({ error: 'User not found' });
        res.json(user); // מחזיר את המשתמש כולל userType
    });
};
//יצירת משתמש
const createUser = (req, res) => {
    usersService.createUser(req.body, (err, newUser) => {
        if (err) return res.status(500).json({ "error": err });
        res.status(201).json(newUser); // מחזירים את המשתמש שנוצר או את ה-ID
    });
};
module.exports = {
    getUser,
    createUser,
    getUserById
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

