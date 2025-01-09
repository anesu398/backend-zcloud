const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { Bucket } = require('../models/bucket');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// List buckets
router.get('/', verifyToken, async (req, res) => {
  try {
    const buckets = await Bucket.find({});
    res.status(200).json(buckets);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch buckets' });
  }
});

// Create a new bucket
router.post('/create', verifyToken, async (req, res) => {
  const { bucketName } = req.body;
  const bucketPath = path.join(__dirname, '../buckets', bucketName);

  try {
    if (fs.existsSync(bucketPath)) {
      return res.status(400).json({ error: 'Bucket already exists' });
    }
    fs.mkdirSync(bucketPath);
    const bucket = new Bucket({ name: bucketName });
    await bucket.save();
    res.status(201).json({ message: 'Bucket created successfully', bucket });
  } catch (err) {
    res.status(500).json({ error: 'Bucket creation failed' });
  }
});

// Delete a bucket
router.delete('/:bucketName', verifyToken, async (req, res) => {
  const bucketPath = path.join(__dirname, '../buckets', req.params.bucketName);

  try {
    await Bucket.deleteOne({ name: req.params.bucketName });
    fs.rmSync(bucketPath, { recursive: true, force: true });
    res.status(200).json({ message: 'Bucket deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Bucket deletion failed' });
  }
});

module.exports = router;
