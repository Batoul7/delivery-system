const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
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
    deliveryLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      }
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
    proximityNotified: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

// Geographic index to enable distance calculations
OrderSchema.index({ deliveryLocation: '2dsphere' });

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
