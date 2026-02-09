const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth'); // 🔥 Import admin auth middleware
const adminController = require('../controllers/adminController');

// 🔥 SECURITY: Apply admin auth middleware to ALL routes below this line
router.use(adminAuth);

// --- Dashboard ---
// URL: /api/admin/dashboard
router.get('/dashboard', adminController.getDashboardData);
router.get('/all-bookings', adminController.getAllBookings);

// --- Buses ---
// URL: /api/admin/buses
router.get('/buses', adminController.getBuses);
router.post('/add-bus', adminController.addBus);
router.delete('/bus/:id', adminController.deleteBus);

// --- Routes (Bus Routes) ---
// URL: /api/admin/routes
router.get('/routes', adminController.getRoutes);
router.post('/add-route', adminController.addRoute);
router.delete('/route/:id', adminController.deleteRoute);
router.put('/route-status/:id', adminController.updateRouteStatus);

// --- Schedules ---
// URL: /api/admin/schedules
router.get('/schedules', adminController.getSchedules);
router.post('/add-schedule', adminController.addSchedule);
router.get('/form-data', adminController.getFormData);
router.delete('/trip/:id', adminController.deleteSchedule);
router.get('/passengers/:id', adminController.getTripPassengers);

// --- Passengers ---
// URL: /api/admin/passengers
router.get('/passengers', adminController.getPassengers);
router.get('/passenger-history/:id', adminController.getPassengerHistory);
router.put('/passenger-status/:id', adminController.updatePassengerStatus);
router.delete('/passenger/:id', adminController.deletePassenger);
router.post('/add-passenger', adminController.addPassenger);

module.exports = router;