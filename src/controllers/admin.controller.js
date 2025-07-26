const User = require("../models/User");
const Log = require("../models/Log");

// إدارة المستخدمين - GET /users/admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    await Log.create({
      action: "GET_USERS",
      user: req.user.id,
      ip: req.ip,
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// حذف مستخدم - DELETE /users/admin/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Log.create({
      action: "DELETE_USER",
      user: req.user.id,
      details: { deletedUser: req.params.id },
      ip: req.ip,
    });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// عرض سجلات النظام - GET /logs/admin
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().populate("user", "username email");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
