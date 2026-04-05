const User = require("../models/user.model");
const ApiError = require("../../../utils/ApiError");

const getAllUsers = async () => {
  return User.find({ isActive: true }).select("-__v");
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-__v");
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const updateUserRole = async (id, role) => {
  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select("-__v");
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const deactivateUser = async (id, requesterId) => {
  if (id === requesterId.toString()) {
    throw new ApiError(400, "You cannot deactivate your own account");
  }
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  ).select("-__v");
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

module.exports = { getAllUsers, getUserById, updateUserRole, deactivateUser };