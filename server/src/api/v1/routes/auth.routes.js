const router = require("express").Router();
const { register, login } = require("../controllers/auth.controller");
const { registerRules, loginRules, handleValidation } = require("../validators/auth.validator");

router.post("/register", registerRules, handleValidation, register);
router.post("/login",    loginRules,    handleValidation, login);

module.exports = router;