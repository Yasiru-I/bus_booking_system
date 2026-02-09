const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// --- Admin Routes ---
router.post('/admin/login', authController.adminLogin);
router.post('/admin/logout', authController.adminLogout);
router.get('/admin/check-auth', authController.checkAuth);

// --- User Routes ---
router.post('/login', authController.userLogin);
router.post('/register', authController.registerUser);

// --- 🔥 Public Routes (Passenger Count) ---
// මේකෙන් තමයි Home Page එකේ Happy Travelers ගණන ගන්නේ
router.get('/passenger-count', authController.getPassengerCount);

module.exports = router;