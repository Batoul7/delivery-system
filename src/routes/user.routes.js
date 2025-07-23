const express = require('express');
const router = express.Router();
const { getMe, updateMe, getDrivers } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// GET /api/users/me
router.get('/me', protect, getMe);

// PUT /api/users/me
router.put('/me', protect, updateMe);

// GET /api/users/drivers
router.get('/drivers', protect, getDrivers);

module.exports = router;