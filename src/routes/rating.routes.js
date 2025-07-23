const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating.controller");
const { verifyToken, allowRoles } = require("../middlewares/auth.middleware");
const {
  createRatingRules,
  getDriverRatingsRules,
  validate,
} = require("../validators/rating.validator");

// Add new rating - Only Client
router.post(
  "/api",
  verifyToken,
  allowRoles("Client"),
  createRatingRules(),
  validate,
  ratingController.createRating
);

// Get ratings for specific driver - Any authenticated user
router.get(
  "/driverId/:driver/ratings/api",
  verifyToken,
  getDriverRatingsRules(),
  validate,
  ratingController.getDriverRatings
);

module.exports = router;