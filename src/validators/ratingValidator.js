const { body, param } = require("express-validator");
const { validate } = require("../helpers/validate"); 

const createRatingRules = () => {
  return [
    body("driver")
      .notEmpty()
      .withMessage("Driver ID is required.")
      .isMongoId()
      .withMessage("Invalid Driver ID."),

    body("order")
      .notEmpty()
      .withMessage("Order ID is required.")
      .isMongoId()
      .withMessage("Invalid Order ID."),

    body("stars")
      .notEmpty()
      .withMessage("Stars rating is required.")
      .isInt({ min: 0, max: 5 })
      .withMessage("Stars rating must be between 0 and 5."),

    body("comment")
      .optional()
      .trim()
      .isString()
      .withMessage("Comment must be a string.")
      .isLength({ max: 500 })
      .withMessage("Comment must be less than 500 characters."),
  ];
};


const getDriverRatingsRules = () => {
  return [
    param("driver")
      .notEmpty()
      .withMessage("Driver ID parameter is required.")
      .isMongoId()
      .withMessage("Invalid Driver ID."),
  ];
};

module.exports = {
  createRatingRules,
  getDriverRatingsRules,
  validate,
};