const express = require("express");
const router = express.Router();
const locationController = require("../controllers/loaction.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const handleId = require("../middleware/handleId.middleware");

router.post(
  "/",
  protect,
  authorize("Driver"),
  locationController.updateLocation
);

router.get(
  "/driver/:driverId",
  [protect, authorize("Client", "Admin"), handleId],
  locationController.getLocation
);

module.exports = router;
