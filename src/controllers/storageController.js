const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { aws } = require("../config/config");

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: aws.accessKeyId,
  secretAccessKey: aws.secretAccessKey,
  region: aws.region,
});

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload a file
exports.uploadFile = [
  upload.single("file"),
  async (req, res, next) => {
    try {
      const fileContent = fs.readFileSync(req.file.path);

      const params = {
        Bucket: aws.bucketName,
        Key: req.file.filename,
        Body: fileContent,
        ContentType: req.file.mimetype,
      };

      // Uploading files to the bucket
      const data = await s3.upload(params).promise();

      // Delete file from local uploads folder after upload
      fs.unlinkSync(req.file.path);

      res.status(201).json({ message: "File uploaded successfully", fileUrl: data.Location });
    } catch (err) {
      next(err);
    }
  },
];

// Download a file
exports.downloadFile = async (req, res, next) => {
  try {
    const { filename } = req.params;

    const params = {
      Bucket: aws.bucketName,
      Key: filename,
    };

    const fileStream = s3.getObject(params).createReadStream();

    fileStream.on("error", (err) => {
      return res.status(404).json({ message: "File not found" });
    });

    res.attachment(filename);
    fileStream.pipe(res);
  } catch (err) {
    next(err);
  }
};
