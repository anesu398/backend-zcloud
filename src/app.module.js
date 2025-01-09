const { createConnection } = require('typeorm');
const userEntity = require('./entities/user.entity');

(async () => {
  try {
    const connection = await createConnection({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USER || 'your_username',
      password: process.env.DB_PASS || 'your_password',
      database: process.env.DB_NAME || 'shedsens_zcloud_db',
      entities: [userEntity], // Add all entity modules here
      synchronize: true, // Auto-create tables based on entities
    });

    console.log('Database connected successfully!');
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
})();
