const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

//  Create a new delivery order
//  POST /orders/api
//  Private (Client only)
const createOrder = asyncHandler(async (req, res) => {
  const { pickupAddress, deliveryAddress, description, expectedDeliveryTime } = req.body;

  const newOrder = await Order.create({
    client: req.user._id,
    pickupAddress,
    deliveryAddress,
    description,
    expectedDeliveryTime,
  });

  res.status(201).json(newOrder);
});

//   Get all available orders (not accepted yet)
//   GET /available/orders/api
//   Private (Driver only)
const getAvailableOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ status: 'pending' }).populate('client', 'name');
  res.status(200).json(orders);
});

//  Accept an order (assign to current driver)
//  PUT /accept/id/:id/orders/api
//  Private (Driver only)
const acceptOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.status !== 'pending') {
    res.status(400);
    throw new Error('Order is already accepted or processed');
  }

  // Assign the order to the driver and change status
  order.driver = req.user._id;
  order.status = 'accepted';
  await order.save();

  res.status(200).json({ message: 'Order accepted', order });
});

module.exports = {
  createOrder,
  getAvailableOrders,
  acceptOrder,
};