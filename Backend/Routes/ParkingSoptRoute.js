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

// Create parking spot (no token required)
router.post("/create", createParkingSpot);

// Search for parking spots (token required)
router.get("/search", searchParkingSpots);

// Fetch history of booked parking spots (token required)
router.get("/advancebookhistory", authenticateUser, getAdvanceBookingHistory);

// Get a parking spot by ID (no token required)
router.get("/:id", getParkingSpotById);

// Book a parking spot (token required)
router.post("/advancebook", authenticateUser, bookParkingSpot);

module.exports = router;
