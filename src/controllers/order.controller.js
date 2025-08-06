const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const { getIO } = require("../socket");
const logger = require("../helpers/logger");

//  View all orders with filtering
const getAllOrder = asyncHandler(async (req, res) => {
  const { city, status, driver, page = 1, limit = 10 } = req.query;

  let filter = {};

  if (city) filter.deliveryAddress = { $regex: city, $options: "i" };
  if (status) filter.status = status;
  if (driver) filter.driver = driver;

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  const totalOrders = await Order.countDocuments(filter);

  const orders = await Order.find(filter)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .populate("client", "name email")
    .populate("driver", "name email");

  res.status(200).json({
    total: totalOrders,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalOrders / pageSize),
    count: orders.length,
    orders,
  });
});

// View one order
const getOneOrder = asyncHandler(async (req, res) => {
  const id = req.id;
  const order = await Order.findById(id)
    .populate("client", "name email")
    .populate("driver", "name email");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json(order);
});

// update Data Order
const updateOrder = asyncHandler(async (req, res) => {
  const id = req.id;
  const order = await Order.findByIdAndUpdate(
    id,
    {
      pickupAddress: req.body.pickupAddress,
      deliveryAddress: req.body.deliveryAddress,
      description: req.body.description,
      expectedDeliveryTime: req.body.expectedDeliveryTime,
    },
    { new: true }
  );

  if (!order) return res.status(404).json({ message: "Order not found" });

  await logger.logDataChange(
    req.user._id,
    "Order",
    order._id,
    "UPDATE",
    { updatedFields: req.body },
    req.ip
  );

  res.status(200).json({ message: "update Successfully", order });
});

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const id = req.id;
  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const userId = req.user.id;
  if (order.driver?.toString() !== userId) {
    return res
      .status(403)
      .json({ message: "You are not assigned to this order" });
  }

  const { status } = req.body;
  const allowedStatuses = ["pending", "in_progress", "delivered", "cancelled"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message:
        "Invalid status. Only 'delivered'or 'pending' or 'cancelled' or 'in_progress' are allowed for drivers.",
    });
  }

  order.status = status;

  if (status === "delivered") {
    order.completedAt = new Date();
  }

  await order.save();

  await logger.logDataChange(
    req.user._id,
    "Order",
    order._id,
    "UPDATE",
    { newStatus: order.status },
    req.ip
  );

  res.status(200).json({ message: "Order status updated", order });
});

// Delete order
const deleteOrder = asyncHandler(async (req, res) => {
  const id = req.id;
  const order = await Order.findByIdAndDelete(id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  await logger.logDataChange(
    req.user._id,
    "Order",
    order._id,
    "DELETE",
    { deletedOrderId: order._id },
    req.ip
  );

  res.status(200).json({ message: "Order deleted successfully" });
});

// create order
const createOrder = asyncHandler(async (req, res) => {
  const {
    pickupAddress,
    deliveryAddress,
    description,
    expectedDeliveryTime,
    latitude,
    longitude,
  } = req.body;

  const newOrder = await Order.create({
    client: req.user._id,
    pickupAddress,
    deliveryAddress,
    description,
    expectedDeliveryTime,
    deliveryLocation: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  });

  await logger.logDataChange(
    req.user._id,
    "Order",
    newOrder._id,
    "CREATE",
    {
      pickupAddress,
      deliveryAddress,
      expectedDeliveryTime,
    },
    req.ip
  );

  const io = getIO();
  io.to("drivers_room").emit("newOrderAvailable", newOrder);
  console.log("Notified drivers about a new order.");

  res.status(201).json(newOrder);
});

//  View available orders for the driver
const getAvailableOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ status: "pending" }).populate(
    "client",
    "name"
  );
  res.status(200).json(orders);
});

//  Acceptance order by the driver
const acceptOrder = asyncHandler(async (req, res) => {
  const id = req.id;
  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  if (order.status !== "pending") {
    return res
      .status(400)
      .json({ message: "Order is already accepted or processed" });
  }

  order.driver = req.user._id;
  order.status = "accepted";
  await order.save();

  const updatedOrder = await Order.findById(id).populate(
    "driver",
    "name phone"
  );

  const io = getIO();
  io.to(id).emit("orderAccepted", {
    message: `Your request has been accepted by the driver.${updatedOrder.driver.name}`,
    order: updatedOrder,
  });
  console.log(`Notified client about order acceptance for order: ${id}`);

  await logger.logDataChange(
    req.user._id,
    "Order",
    order._id,
    "UPDATE",
    { acceptedBy: req.user._id },
    req.ip
  );

  res.status(200).json({ message: "Order accepted", order: updatedOrder });
});

module.exports = {
  getAllOrder,
  getOneOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  createOrder,
  getAvailableOrders,
  acceptOrder,
};
