const express = require("express");
const router = express.Router();
const {
  getAllOrder,
  getOneOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/order.controller");
const {
  createOrderRules,
  updateOrderStatusRules,
  updateOrderRules,
  validate,
  deleteOrderRules,
} = require("../validators/OrderValidator");
const { protect, authorize } = require("../middleware/auth.middleware");
const handleId = require("../middleware/handleId.middleware");

router.get("/", [protect, authorize("Admin")], validate, getAllOrder);

router.get(
  "/:id",
  [protect, authorize("Client", "Driver", "Admin"), handleId],
  getOneOrder
);

router.put(
  "/:id",
  [protect, authorize("Admin"), updateOrderRules(), validate, handleId],
  updateOrder
);

router.put(
  "/status/:id",
  [protect, authorize("Driver"), updateOrderStatusRules(), validate, handleId],
  updateOrderStatus
);

router.delete(
  "/:id",
  [protect, authorize("Admin"), deleteOrderRules(), validate, handleId],
  deleteOrder
);

module.exports = router;
