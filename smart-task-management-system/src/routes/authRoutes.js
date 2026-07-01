const express = require("express");

const authController = require("../controllers/authController");
const authenticate = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/authValidator");

const router = express.Router();

router.post("/register", registerValidator, validateRequest, authController.register);
router.post("/login", loginValidator, validateRequest, authController.login);
router.post("/forgot-password", forgotPasswordValidator, validateRequest, authController.forgotPassword);
router.post("/reset-password", resetPasswordValidator, validateRequest, authController.resetPassword);
router.get("/profile", authenticate, authController.profile);
router.post("/logout", authenticate, authController.logout);

module.exports = router;
