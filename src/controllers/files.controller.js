const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// Upload new version of a file
const uploadNewVersion = async (req, res) => {
  const { fileId } = req.params;
  const versionNumber = req.body.versionNumber || 1;
  const file = req.file; // Assuming file upload middleware is in use

  try {
    const filePath = path.join(__dirname, '../uploads/', file.filename);

    // Insert the new version metadata into the database
    await db.execute(
      `INSERT INTO file_versions (file_id, version_number, file_path) VALUES (?, ?, ?)`,
      [fileId, versionNumber, filePath]
    );

    res.status(200).json({ message: 'New version uploaded successfully' });
  } catch (error) {
    console.error('[Error] Uploading file version:', error);
    res.status(500).json({ error: 'Failed to upload file version' });
  }
};

// Get all versions of a file
const getFileVersions = async (req, res) => {
  const { fileId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT * FROM file_versions WHERE file_id = ? ORDER BY version_number DESC`,
      [fileId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('[Error] Fetching file versions:', error);
    res.status(500).json({ error: 'Failed to fetch file versions' });
  }
};

module.exports = {
  uploadNewVersion,
  getFileVersions,
};
