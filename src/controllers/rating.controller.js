const asyncHandler = require('express-async-handler');
const Rating = require('../models/Rating');
const Order = require('../models/Order');
const User = require('../models/User');
const logger = require('../helpers/logger');

// Add a new rating
// POST /api/ratings
// Private (Client only)
const addRating = asyncHandler(async (req, res) => {
  const { orderId, driverId, stars, comment } = req.body;

  // 1. Check if order exists and belongs to current user
  const existingOrder = await Order.findById(orderId);
  if (!existingOrder || existingOrder.client.toString() !== req.user._id.toString()) {
    await logger.log('ACCESS', {
      user: req.user._id,
      status: 'FAILURE',
      ip: req.ip,
      details: { reason: 'Unauthorized rating attempt', orderId },
    });
    res.status(403);
    throw new Error('You can only rate your own completed orders');
  }

  // 2. Ensure order is delivered
  if (existingOrder.status !== 'delivered') {
     await logger.log('ACCESS', {
      user: req.user._id,
      status: 'FAILURE',
      ip: req.ip,
      details: { reason: 'Order not delivered yet', orderId },
    });
    res.status(400);
    throw new Error('You can only rate delivered orders');
  }

  // 3. Prevent duplicate ratings
  const existingRating = await Rating.findOne({ orderId });
  if (existingRating) {
     await logger.log('CREATE', {
      user: req.user._id,
      status: 'FAILURE',
      ip: req.ip,
      details: { reason: 'Duplicate rating attempt', orderId },
    });
    res.status(400);
    throw new Error('This order has already been rated');
  }

  // 4. Create rating
  const rating = await Rating.create({
    orderId,
    driverId,
    clientId: req.user._id,
    stars,
    comment,
  });

  // 5. Recalculate average rating for driver
  const ratings = await Rating.find({ driverId });
  const totalStars = ratings.reduce((acc, r) => acc + r.stars, 0);
  const avg = totalStars / ratings.length;

  await User.findByIdAndUpdate(driverId, {
    averageRating: avg.toFixed(2),
  });

  // Log successful rating
  await logger.logDataChange(
    req.user._id,
    'Rating',
    rating._id,
    'CREATE',
    { stars, comment, orderId, driverId },
    req.ip
  );

  // 6. Respond with success
  res.status(201).json({
    message: 'Rating added successfully',
    rating,
    averageRating: avg.toFixed(2),
  });
});



// Get all ratings for a specific driver
// GET /api/ratings/driver/:driverId
// Public
const getDriverRatings = asyncHandler(async (req, res) => {
  const ratings = await Rating.find({ driverId: req.params.driverId }).populate('clientId', 'name');

  let averageRating = 0;
  if (ratings.length > 0) {
    const total = ratings.reduce((acc, r) => acc + r.stars, 0);
    averageRating = (total / ratings.length).toFixed(2);
  }

  res.status(200).json({
    driverId: req.params.driverId,
    totalRatings: ratings.length,
    averageRating,
    ratings,
  });
});

module.exports = {
  addRating,
  getDriverRatings,
};