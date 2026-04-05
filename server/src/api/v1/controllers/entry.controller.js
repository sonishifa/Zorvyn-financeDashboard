const asyncHandler = require("../../../utils/asyncHandler");
const ApiResponse = require("../../../utils/ApiResponse");
const entryService = require("../services/entry.service");

const createEntry = asyncHandler(async (req, res) => {
  const entry = await entryService.createEntry(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, entry, "Entry created"));
});

const getAllEntries = asyncHandler(async (req, res) => {
  const result = await entryService.getAllEntries(req.query);
  res.status(200).json(new ApiResponse(200, result, "Entries fetched"));
});

const getEntryById = asyncHandler(async (req, res) => {
  const entry = await entryService.getEntryById(req.params.id);
  res.status(200).json(new ApiResponse(200, entry, "Entry fetched"));
});

const updateEntry = asyncHandler(async (req, res) => {
  const entry = await entryService.updateEntry(req.params.id, req.body, req.user);
  res.status(200).json(new ApiResponse(200, entry, "Entry updated"));
});

const deleteEntry = asyncHandler(async (req, res) => {
  await entryService.deleteEntry(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Entry deleted"));
});

module.exports = { createEntry, getAllEntries, getEntryById, updateEntry, deleteEntry };