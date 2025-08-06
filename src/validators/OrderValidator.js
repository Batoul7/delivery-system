const { body, validationResult, param } = require("express-validator");
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

    // --- الإضافة الرئيسية هنا ---
    // إضافة قواعد التحقق لخطوط الطول والعرض
    body("latitude")
      .notEmpty()
      .withMessage("Latitude is required.")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Latitude must be a valid number between -90 and 90."),

    body("longitude")
      .notEmpty()
      .withMessage("Longitude is required.")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Longitude must be a valid number between -180 and 180."),
    // --- نهاية الإضافة ---
  ];
};
const updateOrderRules = () => {
  return [
    body("pickupAddress")
      .optional()
      .trim()
      .isLength({ min: 5, max: 255 })
      .withMessage("Pickup address must be between 5 and 255 characters."),

    body("deliveryAddress")
      .optional()
      .trim()
      .isLength({ min: 5, max: 255 })
      .withMessage("Delivery address must be between 5 and 255 characters."),

    body("expectedDeliveryTime")
      .optional()
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
      .isIn(["pending", "in_progress", "delivered", "cancelled"])
      .withMessage(
        "Invalid status. Only 'delivered'or 'pending' or 'cancelled' or 'in_progress' are allowed for drivers."
      ),
  ];
};

const deleteOrderRules = () => {
  return [
    param("id")
      .notEmpty()
      .withMessage("Order ID is required.")
      .isMongoId()
      .withMessage("Invalid Order ID format."),
  ];
};

module.exports = {
  createOrderRules,
  updateOrderStatusRules,
  updateOrderRules,
  validate,
  deleteOrderRules,
};
