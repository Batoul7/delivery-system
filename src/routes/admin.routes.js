const express = require("express");
const router = express.Router();
const { authenticate } = require("../adminroutes/src/middlewares/auth");
const { adminOnly } = require("../adminroutes/src/middlewares/roleCheck");
const {
  getUsers,
  deleteUser,
  getLogs,
} = require("../controllers/admin.controller");

// Apply authentication and admin check to all routes
router.use(authenticate, adminOnly);

router.get("/users/admin", getUsers);
router.delete("/users/admin/:id", deleteUser);
router.get("/logs/admin", getLogs);

module.exports = router;
