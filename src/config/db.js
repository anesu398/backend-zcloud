const knex = require('knex');

// Knex configuration
const db = knex({
  client: 'mysql', // Replace with your DB (mysql, pg, sqlite3, etc.)
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mydatabase',
  },
});

db.raw('SELECT 1')
  .then(() => console.log('SQL Database connected successfully'))
  .catch((err) => {
    console.error('Error connecting to the database:', err.message);
    process.exit(1); // Exit process with failure
  });

module.exports = db;
