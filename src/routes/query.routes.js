const express = require('express');
const { executeQuery, getPredefinedReport } = require('../controllers/query.controller');
const router = express.Router();

router.post('/custom', executeQuery); // Execute custom query
router.get('/predefined/:reportType', getPredefinedReport); // Fetch predefined report

module.exports = router;
