const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const orderRoutes = require("./order.routes");
const locationRoutes = require("./location.routes")

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);
router.use("/location", locationRoutes);

module.exports = router;
