const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    email: {
      type: 'varchar',
      unique: true,
    },
    password: {
      type: 'varchar',
    },
    storageLimit: {
      type: 'int',
      default: 1024, // Default storage limit in MB
    },
    role: {
      type: 'varchar',
      default: 'user', // Default role
    },
  },
});
