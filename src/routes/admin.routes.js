// update by batoul
const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, getLogs, archiveLogs, deleteLogs } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const handleId = require('../middleware/handleId.middleware');


// GET /api/admin/users
router.get('/users', protect, authorize('Admin'), getUsers);

// DELETE /api/admin/users/:id 
router.delete('/users/:id', protect, authorize('Admin'), handleId, deleteUser);

// GET /api/admin/logs 
router.get('/logs', protect, authorize('Admin'), getLogs);

// POST /api/admin/logs/archive  
router.post('/logs/archive', protect, authorize('Admin'), archiveLogs);

module.exports = router;


// Abdullfatah

// const express = require("express");
// const router = express.Router();
// const { authenticate } = require("../adminroutes/src/middlewares/auth");
// const { adminOnly } = require("../adminroutes/src/middlewares/roleCheck");
// const {
//   getUsers,
//   deleteUser,
//   getLogs,
// } = require("../controllers/admin.controller");

// // Apply authentication and admin check to all routes
// router.use(authenticate, adminOnly);

// router.get("/users/admin", getUsers);
// router.delete("/users/admin/:id", deleteUser);
// router.get("/logs/admin", getLogs);

// module.exports = router;
