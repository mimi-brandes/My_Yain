const express = require('express');
const router = express.Router();
const managerControl = require('../control/managerControl');
// router.use('/tours',)
//הבאת כל היינות
router.get('/wines',          managerControl.getAllWines);
//הבאת כל המדריכים
router.get('/guides',          managerControl.getAllGuides);
//הבאת כל המנהלים
router.get('/managers',          managerControl.getAllManagers);
//הבאת כל הלקוחות
router.get('/customers',          managerControl.getAllCustomers);
//הבאת כל הסיורים
router.get('/tours',          managerControl.getAllTours);
//הבאת כל המכירות
router.get('/sales',          managerControl.getAllSales);
//הבאת כל המכירות
router.get('/productsSold',          managerControl.getAllProductsSold);
//הוספת מנהל
router.post('/signup-manager',          managerControl.addManager);
//הוספת מדריך
router.post('/signup-guide',          managerControl.addGuide);
//עדכון יין
router.post('/wines/update',          managerControl.updateWine);
//עדכון סיור
router.post('/tours/update',          managerControl.updateTour);
//עדכון מדריך
router.post('/guides/update',          managerControl.updateGuide);
//עדכון מנהל
router.post('/managers/update',          managerControl.updateManager);
//עדכון לקוח
router.post('/customers/update',          managerControl.updateCustomer);
//מחיקת יין
router.post('/wines/delete',          managerControl.deleteWine);
//מחיקת סיור
router.post('/tours/delete',          managerControl.deleteTour);
//מחיקת מדריך
router.post('/guides/delete',          managerControl.deleteGuide);
//מחיקת מנהל
router.post('/managers/delete',          managerControl.deleteManager);
//מחיקת לקוח
router.post('/customers/delete',          managerControl.deleteCustomer);
module.exports = router;