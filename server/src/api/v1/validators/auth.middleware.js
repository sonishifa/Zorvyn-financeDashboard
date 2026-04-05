const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../../../utils/ApiError");
const asyncHandler = require("../../../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "No token provided");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws on invalid/expired

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw new ApiError(401, "User no longer exists");

  req.user = user; // available in all downstream handlers
  next();
});

module.exports = { protect };