const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Search with Pagination
router.get('/search', async (req, res) => {
  const { searchTerm, limit = 10, page = 1 } = req.query;
  
  try {
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM data_table
      WHERE data LIKE ?
      LIMIT ? OFFSET ?
    `;
    
    const [results] = await db.execute(query, [`%${searchTerm}%`, parseInt(limit), offset]);
    res.json({ data: results, currentPage: page, totalResults: results.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
