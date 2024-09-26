const multer = require("multer");
const path = require("path");

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "profile-pics"); // Make sure 'profile-pics' directory exists
  },
  filename: (req, file, cb) => {
    cb(null, "profilePicture_" + Date.now() + path.extname(file.originalname)); // Filename with timestamp
  },
});

// Filter to allow only image files (jpeg, png, etc.)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Initialize multer with storage and file filter
const profileImageUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 }, // 1MB limit
});

module.exports = profileImageUpload;
