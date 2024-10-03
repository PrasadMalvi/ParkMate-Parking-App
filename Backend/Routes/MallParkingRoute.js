// routes/mallParkingRoutes.js
const express = require("express");
const router = express.Router();
const {
  addMall,
  getMallDetails,
  getMallParkingDetails,
  generateQRCode,
  startParkingTimer,
  exitParkingScanner,
  getExistingQRCode,
} = require("../controllers/mallParkingController");
const authMiddleware = require("../middleware/authMiddleware");

// Add a new mall
router.post("/add", addMall);

// Fetch mall details
router.get("/malldetails", getMallDetails);

// Fetch parking details (including pricing)
router.get("/parking/:mallId", getMallParkingDetails);

// Generate QR Code for mall parking
router.post("/generate-qrcode/:mallId", authMiddleware, generateQRCode);

// Fetch existing QR Code for parking session by mall ID and user ID
// Fetch existing QR Code for parking session by mall ID and user ID
router.get(
  "/parkingsession/qrcode/:mallId/:vehicleId",
  authMiddleware,
  getExistingQRCode
);

// Scan QR Code to start timer
router.post("/scan/start/:qrCode", authMiddleware, startParkingTimer);

// Scan QR Code to stop timer and calculate price
router.post("/scan/exit/:qrCode", authMiddleware, exitParkingScanner);

module.exports = router;
