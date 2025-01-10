const express = require('express');
const { uploadNewVersion, getFileVersions } = require('../controllers/files.controller');
const upload = require('../middleware/upload'); // Middleware for file upload
const router = express.Router();

router.post('/:fileId/version', upload.single('file'), uploadNewVersion); // Upload new file version
router.get('/:fileId/versions', getFileVersions); // Get all file versions

module.exports = router;
