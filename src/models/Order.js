const mongoose = require("mongoose");

const Order = new mongoose.model(
  "Order",
  mongoose.Schema({
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    expectedDeliveryTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "in_progress", "delivered", "cancelled"],
      default: "pending",
    },
    completedAt: {
      type: Date,
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  })
);

module.exports = mongoose.model("Order") || Order;
