const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAvailableOrders,
  acceptOrder
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/authMiddleware');

//  POST /orders/api
//  Create new order (Client only)
router.post('/orders/api', protect, authorize('Client'), createOrder);

//  GET /available/orders/api
//  Get available orders (Driver only)
router.get('/available/orders/api', protect, authorize('Driver'), getAvailableOrders);

//  PUT /accept/id/:id/orders/api
//  Accept an order (Driver only)
router.put('/accept/id/:id/orders/api', protect, authorize('Driver'), acceptOrder);

module.exports = router;