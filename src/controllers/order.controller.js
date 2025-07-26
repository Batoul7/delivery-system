const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");

const getAllOrder = asyncHandler(async (req, res) => {
  const { city, status, driver } = req.query;
  let filter = {};

  if (city) filter.deliveryAddress = { $regex: city, $options: "i" };
  if (status) filter.status = status;
  if (driver) filter.driver = driver;

  const orders = await Order.find(filter)
    .populate("client", "name email")
    .populate("driver", "name email");
  if (orders.length == 0) {
    return res.status(404).json({ message: "no orders" });
  }
  res.status(200).json(orders);
});

const getOneOrder = asyncHandler(async (req, res) => {
  const id = req.id;
  const userRoulr = req.user.role;
  const s = req.user.id;
  const order = await Order.findById(id)
    .populate("client", "name email")
    .populate("driver", "name email");

  if (!order) {
    return res.status(404).json({ message: "no orders" });
  }

  if (
    userRoulr !== "Admin" &&
    order.client.toString() !== s &&
    order.driver?.toString() !== s
  ) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.status(200).json(order);
});

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

  res.status(200).json({ message: "update Successfully", order });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const id = req.id;
  // if (!id) {
  //   return res.status(400).json({ message: "Order ID is required" });
  // }
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

  const allowedStatuses = [
    "pending",
    "accepted",
    "in_progress",
    "delivered",
    "cancelled",
  ];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message:
        "Invalid status. Only 'in_transit' or 'delivered'or 'pending' or 'cancelled' or 'in_progress' are allowed for drivers.",
    });
  }

  order.status = status;

  if (status === "delivered") {
    order.completedAt = new Date();
  }

  await order.save();

  res.status(200).json({ message: "Order status updated", order });
});

const deleteOrder = asyncHandler(async (req, res) => {
  const id = req.id;
  const order = await Order.findByIdAndDelete(id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.status(200).json({ message: "Order deleted successfully" });
});

module.exports = {
  getAllOrder,
  getOneOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
};
