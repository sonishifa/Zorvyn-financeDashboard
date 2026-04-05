const asyncHandler = require("../../../utils/asyncHandler");
const ApiResponse = require("../../../utils/ApiResponse");
const analyticsService = require("../services/analytics.service");

const getSummary = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSummary(req.query);
  res.status(200).json(new ApiResponse(200, data, "Analytics fetched"));
});

module.exports = { getSummary };