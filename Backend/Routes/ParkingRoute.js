const express = require("express");
const {
  saveParkingLocation,
  getParkingHistory,
} = require("../Controllers/ParkingController");
const authenticateUser = require("../Middleware/authMiddleware");

const router = express.Router();

router.post("/parkhere", authenticateUser, saveParkingLocation);
router.get("/parkinghistory", authenticateUser, getParkingHistory);

module.exports = router;
