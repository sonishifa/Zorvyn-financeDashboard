const router = require("express").Router();
const { getSummary } = require("../controllers/analytics.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/rbac.middleware");

router.get("/summary", protect, authorize("admin", "manager"), getSummary);

module.exports = router;