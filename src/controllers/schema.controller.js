const db = require('../config/db');

// Execute Custom Query
const executeQuery = async (req, res) => {
  const { query } = req.body;

  try {
    // Sanitize input to prevent SQL injection (use placeholders if query parameters are dynamic)
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (error) {
    console.error('[Error] Executing query:', error);
    res.status(400).json({ error: 'Invalid query or syntax error' });
  }
};

// Predefined Reports
const getPredefinedReport = async (req, res) => {
  const { reportType } = req.params;

  try {
    let query;

    switch (reportType) {
      case 'user-activities':
        query = `
          SELECT users.name, activities.activity_type, activities.timestamp
          FROM user_activities AS activities
          JOIN users ON activities.user_id = users.id
          ORDER BY activities.timestamp DESC
        `;
        break;
      case 'transactions-summary':
        query = `
          SELECT users.name, SUM(transactions.amount) AS total_spent
          FROM transactions
          JOIN users ON transactions.user_id = users.id
          GROUP BY users.id
        `;
        break;
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }

    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (error) {
    console.error('[Error] Fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
};

module.exports = {
  executeQuery,
  getPredefinedReport,
};
