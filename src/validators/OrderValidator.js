const { body, validationResult } = require("express-validator");
const { validate } = require("../helpers/validate");

const createOrderRules = () => {
  return [
    body("pickupAddress")
      .trim()
      .notEmpty()
      .withMessage("Pickup address is required.")
      .isLength({ min: 5, max: 255 })
      .withMessage("Pickup address must be between 5 and 255 characters."),

    body("deliveryAddress")
      .trim()
      .notEmpty()
      .withMessage("Delivery address is required.")
      .isLength({ min: 5, max: 255 })
      .withMessage("Delivery address must be between 5 and 255 characters."),

    body("expectedDeliveryTime")
      .notEmpty()
      .withMessage("Expected delivery time is required.")
      .isISO8601()
      .withMessage("Expected delivery time must be a valid ISO 8601 date.")
      .custom((value) => {
        const date = new Date(value);
        if (date < new Date()) {
          throw new Error("Expected delivery time must be in the future.");
        }
        return true;
      }),

    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters."),
  ];
};

const updateOrderStatusRules = () => {
  return [
    body("status")
      .notEmpty()
      .withMessage("Status is required.")
      .isIn(["pending", "accepted", "in_transit", "delivered"])
      .withMessage(
        "Status must be one of: pending, accepted, in_transit, delivered."
      ),
  ];
};

module.exports = {
  createOrderRules,
  updateOrderStatusRules,
  validate,
};
