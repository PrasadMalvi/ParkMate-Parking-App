const express = require("express");
const {
  createFastTag,
  fetchFastTags,
  viewFastTagDetails,
  generateFastTagQRCode,
  exitFastTagScanner,
  getExistingFastTagQRCode,
  getFastTagHistory,
} = require("../controllers/fastTagController");
const authenticateUser = require("../Middleware/authMiddleware");

const router = express.Router();

// Create a new FastTag
router.post("/createFastTag", authenticateUser, createFastTag);

// Fetch all FastTags
router.get("/allfasttag", authenticateUser, fetchFastTags);

// routes/fastTagRoutes.js
router.get("/history/:userId", authenticateUser, getFastTagHistory);

// Get FastTag details
router.get("/viewFastTag/:id", authenticateUser, viewFastTagDetails);

// Generate QR code for FastTag
router.post(
  "/generateQRCode/:fastTagId",
  authenticateUser,
  generateFastTagQRCode
);

// Get existing QR code
router.get(
  "/fasttassession/getQRCode/:fastTagId/:vehicleId",
  authenticateUser,
  getExistingFastTagQRCode
);

// Exit parking
router.post("/exitFastTag/:qrCode", authenticateUser, exitFastTagScanner);

module.exports = router;
