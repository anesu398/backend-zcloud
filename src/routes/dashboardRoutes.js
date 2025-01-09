const express = require("express");
const { getStats, getRecentOrders } = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/stats", authMiddleware, getStats); // Get KPI stats
router.get("/recent-orders", authMiddleware, getRecentOrders); // Get recent orders

module.exports = router;
