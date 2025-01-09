const express = require("express");
const { uploadFile, downloadFile } = require("../controllers/storageController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Only 'admin' and 'developer' can upload/download files
router.use(authMiddleware, roleMiddleware(["admin", "developer"]));

router.post("/upload", uploadFile);
router.get("/download/:filename", downloadFile);

module.exports = router;
