const express = require('express');
const router = express.Router();

// Controller එක හරියටම Import කරගන්නවා
const bookingController = require('../controllers/bookingController');

// 1. Search
router.get('/search', bookingController.searchBuses);

// 2. Book (🔥 මෙතන createBooking තියෙන්න ඕනේ, මොකද Controller එකේ තියෙන්නේ createBooking නිසා)
router.post('/book', bookingController.createBooking);

// 3. My Bookings
router.get('/my-bookings/:user_id', bookingController.getMyBookings);

// 4. Cancel
router.post('/cancel-booking', bookingController.cancelBooking);

// 5. Seats
router.get('/seats/:schedule_id', bookingController.getBookedSeats);

// 6. Last Booking
router.get('/last-booking/:id', bookingController.getLastBooking);

module.exports = router;