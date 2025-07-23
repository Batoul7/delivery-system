const Rating = require("../models/rating.model");
const asyncHandler = require("express-async-handler");

// Create a new rating 
exports.createRating = asyncHandler(async (req, res) => {
  const { driver, order, stars, comment } = req.body;

  const rating = new Rating({
    driver,
    client: req.user.id,
    order,
    stars,
    comment,
  });

  await rating.save();

  res.status(201).json({
    message: "Rating created successfully.",
    rating,
  });
});

// Get all ratings for a specific driver
exports.getDriverRatings = asyncHandler(async (req, res) => {
  const driverId = req.params.driver;

  const ratings = await Rating.find({ driver: driverId })
    .populate("client", "name")
    .populate("order", "_id");

  res.status(200).json(ratings);
});