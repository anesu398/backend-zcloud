const express = require("express");
const { getUsers, updateUser, deleteUser } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getUsers); // Fetch all users
router.put("/:id", authMiddleware, updateUser); // Update a user
router.delete("/:id", authMiddleware, deleteUser); // Delete a user

module.exports = router;
