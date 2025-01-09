const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { File } = require('../models/file');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const bucketPath = path.join(__dirname, '../buckets', req.bucketName);
    if (!fs.existsSync(bucketPath)) {
      return cb(new Error('Bucket does not exist'), false);
    }
    cb(null, bucketPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('File type not allowed'), false);
    }
    cb(null, true);
  },
});

// Middleware to attach bucket name from query
router.use((req, res, next) => {
  req.bucketName = req.query.bucketName;
  next();
});

// List files with pagination
router.get('/', verifyToken, async (req, res) => {
  try {
    const { bucketName } = req.query;
    const files = await File.find({ bucketName }).limit(10);
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch files' });
  }
});

// Upload a file
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const fileData = {
      bucketName: req.bucketName,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
    };
    const file = new File(fileData);
    await file.save();
    res.status(200).json({ message: 'File uploaded successfully', file });
  } catch (err) {
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Download a file
router.get('/download/:filename', verifyToken, (req, res) => {
  const filePath = path.join(__dirname, '../buckets', req.bucketName, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Delete a file
router.delete('/:filename', verifyToken, async (req, res) => {
  const filePath = path.join(__dirname, '../buckets', req.bucketName, req.params.filename);
  try {
    await File.deleteOne({ bucketName: req.bucketName, filename: req.params.filename });
    fs.unlinkSync(filePath);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'File deletion failed' });
  }
});

module.exports = router;
