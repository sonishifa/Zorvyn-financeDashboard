const asyncHandler = require("../../../utils/asyncHandler");
const ApiResponse = require("../../../utils/ApiResponse");
const userService = require("../services/user.service");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json(new ApiResponse(200, users, "Users fetched"));
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json(new ApiResponse(200, user, "User fetched"));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.params.id, req.body.role);
  res.status(200).json(new ApiResponse(200, user, "Role updated"));
});

const deactivateUser = asyncHandler(async (req, res) => {
  await userService.deactivateUser(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, null, "User deactivated"));
});

module.exports = { getAllUsers, getUserById, updateUserRole, deactivateUser };