const Rating = require('./rating.model');
const User = require('../user/user.model');

async function createRating(data) {
  const rating = await Rating.create(data);
  await updateDriverAverage(rating.driverId);
  return rating;
}

async function getRatingsByDriver(driverId) {
  return Rating.find({ driverId });
}

async function getRatingByOrder(orderId) {
  return Rating.findOne({ orderId });
}

async function deleteRating(id) {
  const rating = await Rating.findByIdAndDelete(id);
  if (rating) await updateDriverAverage(rating.driverId);
  return rating;
}

async function updateDriverAverage(driverId) {
  const ratings = await Rating.find({ driverId });
  const avg = ratings.reduce((acc, r) => acc + r.stars, 0) / (ratings.length || 1);
  await User.findByIdAndUpdate(driverId, { rating: avg.toFixed(2) });
}

module.exports = {
  createRating,
  getRatingsByDriver,
  getRatingByOrder,
  deleteRating,
};