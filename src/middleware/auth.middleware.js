const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("payload is :"+ decoded)
      // Get user from the token and attach it to the request object
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if req.user is defined
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    // Check if the user's role is authorized
    if (!roles.includes(req.user.role)) {
      return next(
        new Error(
          `User role '${req.user.role}' is not authorized to access this route`
        )
      );
    }

    next();
  };
};
module.exports = { protect, authorize };
