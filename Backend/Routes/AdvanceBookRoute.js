const express = require("express");
const {
  createParkingSpot,
  searchParkingSpots,
  bookParkingSpot,
  getParkingSpotById,
  getAdvanceBookingHistory,
} = require("../Controllers/ParkingSpotController");
const authenticateUser = require("../Middleware/authMiddleware");

const router = express.Router();

// Search for parking spots (token required)
router.get("/search", authenticateUser, searchParkingSpots);

// Fetch history of booked parking spots (token required)
router.get("/advancebookhistory", authenticateUser, getAdvanceBookingHistory);

// Book a parking spot (token required)
router.post("/advancebook", authenticateUser, bookParkingSpot);

router.get("/:id", authenticateUser, getParkingSpotById);
module.exports = router;
