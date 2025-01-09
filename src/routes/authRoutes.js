const express = require("express");
const { login, register, getCurrentUser } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const { body } = require("express-validator");
const validate = require("../middlewares/validate");

const router = express.Router();

// Register route with validations
router.post(
  "/register",
  validate([
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["admin", "developer", "user"]).withMessage("Invalid role"),
  ]),
  register
);

// Login route with validations
router.post(
  "/login",
  validate([
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
  login
);

// Get current user
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
