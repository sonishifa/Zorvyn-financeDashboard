const User = require("../models/user.model");
const ApiError = require("../../../utils/ApiError");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already registered");

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id);

  // never return the password
  user.password = undefined;
  return { user, token };
};

const login = async ({ email, password }) => {
  // password is select:false on schema — must explicitly request it
  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.isActive) throw new ApiError(401, "Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const token = generateToken(user._id);
  user.password = undefined;
  return { user, token };
};

module.exports = { register, login };