const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  bucketName: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
});

module.exports.File = mongoose.model('File', fileSchema);
