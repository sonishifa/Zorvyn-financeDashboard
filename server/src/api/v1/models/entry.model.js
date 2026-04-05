const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Type is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      // e.g. "Salary", "Marketing", "Utilities", "Sales"
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false, // hidden from query results unless explicitly requested
    },
  },
  { timestamps: true }
);

// ─── Always exclude soft-deleted entries from every query ──────────────────────
entrySchema.pre(/^find/, function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("FinancialEntry", entrySchema);