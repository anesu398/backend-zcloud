const mongoose = require('mongoose');

const bucketSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports.Bucket = mongoose.model('Bucket', bucketSchema);
