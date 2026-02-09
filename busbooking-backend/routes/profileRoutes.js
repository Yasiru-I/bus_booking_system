const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/:user_id', profileController.getProfile);
router.put('/update', profileController.updateProfile);
router.post('/add-passenger', profileController.addCoPassenger);
router.delete('/passenger/:id', profileController.deleteCoPassenger);

module.exports = router;