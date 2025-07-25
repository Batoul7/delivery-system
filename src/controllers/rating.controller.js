const asyncHandler = require('express-async-handler');
const Rating = require('../models/Rating');
const Order = require('../models/Order');

//  Add a new rating
//  POST /ratings/api
//  Private (Client only)
const addRating = asyncHandler(async (req, res) => {
  const { order, driver, stars, comment } = req.body;

  // Check if the order exists and belongs to the authenticated client
  const existingOrder = await Order.findById(order);
  if (!existingOrder || existingOrder.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only rate your own completed orders');
  }

  // Optional: Ensure the order is marked as 'Delivered'
  if (existingOrder.status !== 'Delivered') {
    res.status(400);
    throw new Error('You can only rate delivered orders');
  }

  // Check if the rating for this order already exists
  const existingRating = await Rating.findOne({ order });
  if (existingRating) {
    res.status(400);
    throw new Error('This order has already been rated');
  }

  // Create the new rating
  const rating = await Rating.create({
    order,
    driver,
    client: req.user._id,
    stars,
    comment,
  });

  res.status(201).json(rating);
});

//  Get all ratings for a specific driver
//  GET /driverId/:driver/ratings/api
//  Public
const getDriverRatings = asyncHandler(async (req, res) => {
  // Fetch all ratings by driver ID, also populate client info
  const ratings = await Rating.find({ driver: req.params.driver }).populate('client', 'name');
  res.status(200).json(ratings);
});

module.exports = {
  addRating,
  getDriverRatings
};