const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => e.msg),
    });
  }
  next();
};

const entryRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("amount").isFloat({ min: 0 }).withMessage("Amount must be a positive number"),
  body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("date").optional().isISO8601().withMessage("Invalid date format"),
];

module.exports = { entryRules, handleValidation };