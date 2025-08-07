const express = require('express');
const router = express.Router();
const { addRating, getDriverRatings } = require('../controllers/rating.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const {
  createRatingRules,
  getDriverRatingsRules,
  validate,
} = require('../validators/ratingValidator'); 

//  Create a new rating for a driver (Client only)
// POST /api/ratings
router.post(
  '/',
  protect,
  authorize('Client'),
  createRatingRules(), 
  validate,           
  addRating
);

//  Get all ratings for a specific driver (Public access)
// GET /api/ratings/driver/:driverId
router.get(
  '/driver/:driverId',
  protect,
  getDriverRatingsRules(),
  validate,
  getDriverRatings
);

module.exports = router;