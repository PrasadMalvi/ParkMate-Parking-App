// Routes/MallParkingRoute.js
const express = require("express");
const authenticateUser = require("../Middleware/authMiddleware");
const {
  createMallParking,
  scanEntryQRCode,
  scanExitQRCode,
} = require("../Controllers/MallParkingController");

const router = express.Router();

// Route to create a new mall parking entry
router.post("/", createMallParking);

// Route to scan entry QR code
router.post("/entry", authenticateUser, scanEntryQRCode);

// Route to scan exit QR code
router.post("/exit", authenticateUser, scanExitQRCode);

module.exports = router;
