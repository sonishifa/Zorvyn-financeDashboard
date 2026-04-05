const router = require("express").Router();
const { createEntry, getAllEntries, getEntryById, updateEntry, deleteEntry } = require("../controllers/entry.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/rbac.middleware");
const { entryRules, handleValidation } = require("../validators/entry.validator");

router.use(protect); // all entry routes require login

router.get("/",     getAllEntries);                                         // all roles
router.get("/:id",  getEntryById);                                         // all roles
router.post("/",    authorize("admin", "manager"), entryRules, handleValidation, createEntry);
router.patch("/:id",authorize("admin", "manager"), entryRules, handleValidation, updateEntry);
router.delete("/:id",authorize("admin"),           deleteEntry);           // admin only

module.exports = router;