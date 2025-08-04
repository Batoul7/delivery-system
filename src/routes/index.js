const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const userRoutes = require("./user.routes");
const orderRoutes = require("./order.routes");
const locationRoutes = require("./location.routes")
const ratingRoutes = require("./rating.routes")

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);
router.use("/location", locationRoutes);
router.use("/ratings", ratingRoutes);

module.exports = router;
