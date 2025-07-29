const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const aragon2 = require("argon2");
const generateToken = require("../helpers/generateToken");
const crypto = require("crypto");
const sendEmail = require("../helpers/sendEmail");

//  Register a new user
//  POST /api/auth/register
//  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, role, location } = req.body;

  if (role && role === 'Admin') {
    res.status(403);
    throw new Error('Admin registration is not allowed.');
  }

  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    role,
    location,
  });

  const tokenPayload = { id: user._id, email: user.email, role: user.role };

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(tokenPayload),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//  Authenticate user & get token
//  POST /api/auth/login
//  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  
   const tokenPayload = { id: user._id, email: user.email, role: user.role };
  if (user && (await aragon2.verify(user.password, password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(tokenPayload),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//  Change user password
//  PUT /api/auth/change-password
//  Private
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);

  if (user && (await aragon2.verify(user.password, oldPassword))) {
    user.password = newPassword;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password changed successfully." });
  } else {
    res.status(401);
    throw new Error("Incorrect old password.");
  }
});

//  Forgot password
//  POST /api/auth/forgot-password
//  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res
      .status(200)
      .json({
        success: true,
        message:
          "If a user with that email exists, a reset token has been sent.",
      });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/reset-password/${resetToken}`;
  const message = `Forgot your password? Submit a PUT request with your new password to: \n\n ${resetURL} \n\nIf you didn't forget your password, please ignore this email!`;

  await sendEmail({
    email: user.email,
    subject: "Your password reset token (valid for 10 min)",
    message,
  });

  res.status(200).json({ success: true, message: "Token sent to email!" });
});

//  Reset password
//  PUT /api/auth/reset-password/:token
//  Public
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Token is invalid or has expired");
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const tokenPayload = { id: user._id, email: user.email, role: user.role };
  const token = generateToken(tokenPayload);
  res.status(200).json({ success: true, token });
});

//  Logout user
//  POST /api/auth/logout
//  Private
const logoutUser = (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully." });
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword,
  logoutUser,
};
