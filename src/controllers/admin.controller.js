const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Log = require("../models/Log");
const logger = require("../helpers/logger");

// Get all users
exports.getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");

    logger.log('ACCESS', {
        user: req.user.id,
        ip: req.ip,
        status: 'SUCCESS',
        details: { resource: 'all_users_list' }
    });

    res.json(users);
});

//  DELETE /api/admin/users/:id
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
        logger.logDataChange(
            req.user.id,
            'User',
            req.params.id,
            'DELETE',
            { error: 'User not found' },
            req.ip,
            'FAILURE' 
        );
        res.status(404);
        throw new Error("User not found");
    }

    logger.logDataChange(
        req.user.id,
        'User',
        req.params.id,
        'DELETE',
        { deletedEmail: user.email },
        req.ip
    );

    res.json({ message: "User deleted successfully" });
});

// GET /api/admin/logs
exports.getLogs = asyncHandler(async (req, res) => {
    const { page = 1, limit = 50, user, action, status } = req.query;

    const filter = {};
    if (user) filter.user = user;
    if (action) filter.action = action;
    if (status) filter.status = status;

    const logs = await Log.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((page - 1) * limit);

    const total = await Log.countDocuments(filter);

    logger.log('ACCESS', {
        user: req.user.id,
        ip: req.ip,
        status: 'SUCCESS',
        details: { resource: 'system_logs', filterApplied: req.query }
    });

    res.json({
        success: true,
        data: logs,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
        },
    });
});
