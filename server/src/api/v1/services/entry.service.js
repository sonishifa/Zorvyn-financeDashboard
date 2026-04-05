const Entry = require("../models/entry.model");
const ApiError = require("../../../utils/ApiError");

const createEntry = async (data, userId) => {
  return Entry.create({ ...data, createdBy: userId });
};

const getAllEntries = async (query) => {
  const filter = {};

  // filtering
  if (query.type)     filter.type = query.type;
  if (query.category) filter.category = query.category;

  // date range
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = new Date(query.from);
    if (query.to)   filter.date.$lte = new Date(query.to);
  }

  // pagination
  const page  = Math.max(1, parseInt(query.page)  || 1);
  const limit = Math.min(100, parseInt(query.limit) || 10);
  const skip  = (page - 1) * limit;

  const [entries, total] = await Promise.all([
    Entry.find(filter)
      .populate("createdBy", "name email role")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    Entry.countDocuments(filter),
  ]);

  return { entries, total, page, totalPages: Math.ceil(total / limit) };
};

const getEntryById = async (id) => {
  const entry = await Entry.findById(id).populate("createdBy", "name email");
  if (!entry) throw new ApiError(404, "Entry not found");
  return entry;
};

const updateEntry = async (id, data, user) => {
  const entry = await Entry.findById(id);
  if (!entry) throw new ApiError(404, "Entry not found");

  // viewers cannot update, managers can only update their own
  if (user.role === "manager" && entry.createdBy.toString() !== user._id.toString()) {
    throw new ApiError(403, "You can only update your own entries");
  }

  return Entry.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteEntry = async (id) => {
  const entry = await Entry.findById(id);
  if (!entry) throw new ApiError(404, "Entry not found");

  // soft delete — never lose financial records
  entry.isDeleted = true;
  await entry.save();
};

module.exports = { createEntry, getAllEntries, getEntryById, updateEntry, deleteEntry };