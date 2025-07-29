const asyncHandler = require('express-async-handler');
const Rating = require('../models/Rating');
const Order = require('../models/Order');
const User = require('../models/User');


//  Add a new rating
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
  if (existingOrder.status !== 'delivered') {
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

  // Update driver's average rating
  const ratings = await Rating.find({ driver });

  const totalStars = ratings.reduce((acc, item) => acc + item.stars, 0);
  const avg = totalStars / ratings.length;

  await User.findByIdAndUpdate(driver, {
    averageRating: avg.toFixed(2),
  });

 res.status(201).json({
  message: 'Rating added successfully',
  rating,
  averageRating: avg.toFixed(2),
});
});

//  Get all ratings for a specific driver
//  GET /:driverId
//  Public
const getDriverRatings = asyncHandler(async (req, res) => {
  // Fetch all ratings by driver ID, also populate client info
  const ratings = await Rating.find({ driver: req.params.driver }).populate('client', 'name');

 const driverData = await User.findById(req.params.driver).select('averageRating');

 res.status(200).json({
    driverId: req.params.driver,
    totalRatings: ratings.length,
    averageRating: driverData?.averageRating || 0,
    ratings,
  });
});

module.exports = {
  addRating,
  getDriverRatings
};