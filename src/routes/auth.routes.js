const express = require('express');
const router = express.Router();
const { registerUser, loginUser , forgotPassword, resetPassword , logoutUser, changePassword} = require('../controllers/auth.controller');
const { registerRules,changePasswordRules, validate, resetPasswordRules, forgotPasswordRules } = require('../validators/userValidator');
const { protect } = require('../middleware/auth.middleware');

// POST /api/auth/register
router.post('/register', registerRules(), validate, registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

// POST /api/auth/logout
router.post('/logout', protect, logoutUser); 

// PUT /api/auth/change-password
router.put('/change-password', protect, changePasswordRules(), validate, changePassword);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPasswordRules(), validate, forgotPassword);

// PUT /api/auth/reset-password/:token
router.put('/reset-password/:token', resetPasswordRules(), validate, resetPassword);

module.exports = router;