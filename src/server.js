const app = require('./App');
const { createConnection } = require('typeorm');

// Database connection setup
(async () => {
  try {
    await createConnection({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USER || 'your_username',
      password: process.env.DB_PASS || 'your_password',
      database: process.env.DB_NAME || 'shedsens_zcloud_db',
      entities: ['./entities/*.js'], // Path to your entity files
      synchronize: true,
    });

    console.log('Database connected successfully!');

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
})();
