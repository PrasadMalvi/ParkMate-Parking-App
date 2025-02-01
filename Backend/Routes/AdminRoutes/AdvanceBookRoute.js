const express = require("express");
const {
  createParkingSpot,
  updateParkingSpot,
  getParkingSpotById,
  updateProfile,
  manageBookings,
} = require("../../controllers/AdminController/AdvanceBookingController");
const authenticateUser = require("../../middleware/authMiddleware");

const router = express.Router();

// Create parking spot
router.post("/create", authenticateUser, createParkingSpot);

// Update parking spot
router.put("/update/:id", authenticateUser, updateParkingSpot);

// Get parking spot by ID
router.get("/:id", authenticateUser, getParkingSpotById);

// Update user profile
router.put("/profile/update", authenticateUser, updateProfile);

// Manage bookings
router.get("/bookings/manage", authenticateUser, manageBookings);

module.exports = router;
