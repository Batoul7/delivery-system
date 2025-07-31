const express = require('express');
const router = express.Router();
const { addRating, getDriverRatings } = require('../controllers/rating.controller');
const { protect, authorize } = require('../middleware/auth.middleware');


//  Create a new rating for a driver (Client only)
// POST /api/ratings
router.post('/', protect, authorize('Client'), addRating);

 
//  Get all ratings for a specific driver (Public access)
// GET /api/ratings/driver/:driverId
router.get('/driver/:driverId', getDriverRatings);

module.exports = router;