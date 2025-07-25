const express = require('express');
const router = express.Router();
const { addRating, getDriverRatings } = require('../controllers/ratingController');
const { protect, authorize } = require('../middleware/authMiddleware');

//  POST /ratings/api
//  Create a new rating for a driver (Client only)
router.post('/ratings/api', protect, authorize('Client'), addRating);

//  GET /driverId/:driver/ratings/api
//  Get all ratings for a specific driver (Public access)
router.get('/driverId/:driver/ratings/api', getDriverRatings);

module.exports = router;