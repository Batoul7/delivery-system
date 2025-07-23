const asyncHandler = require('express-async-handler');
const User = require('../models/User');

//  Get current user data
//  GET /api/users/me
//  Private
const getMe = (req, res) => {
    res.status(200).json(req.user);
};

//  Update user data
//  PUT /api/users/me
//  Private
const updateMe = asyncHandler(async (req, res) => {
    const { name, phoneNumber, location } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id, 
        { name, phoneNumber, location }, 
        { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json(updatedUser);
});

//  Get all drivers
//  GET /api/users/drivers
//  Private
const getDrivers = asyncHandler(async (req, res) => {
    const drivers = await User.find({ role: 'Driver' }).select('-password');
    res.status(200).json(drivers);
});

module.exports = {
    getMe,
    updateMe,
    getDrivers,
};