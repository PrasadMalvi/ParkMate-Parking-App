// routes/mallParkingRoutes.js
const express = require("express");
const router = express.Router();
const {
  getMallDetails,
  generateQRCode,
  getExistingQRCode,
  getMallParkingHistory,
} = require("../controllers/mallParkingController");
const authenticateUser = require("../middleware/authMiddleware");

// Fetch mall details
router.get("/malldetails", authenticateUser, getMallDetails);

// Generate QR Code for mall parking
router.post("/generate-qrcode/:mallId", authenticateUser, generateQRCode);

// Fetch existing QR Code for parking session by mall ID and user ID
router.get(
  "/parkingsession/qrcode/:mallId/:vehicleId",
  authenticateUser,
  getExistingQRCode
);

// routes/mallParkingRoutes.js
router.get("/history/:userId", authenticateUser, getMallParkingHistory);

module.exports = router;
