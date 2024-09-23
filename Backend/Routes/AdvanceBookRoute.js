const express = require("express");
const {
  searchParkingSpot,
  bookParkingSpot,
} = require("../Controllers/AdvanceBookController");
const authenticateUser = require("../Middleware/authMiddleware");

const router = express.Router();

// Authenticated routes for searching and booking parking spots
router.get("/search", authenticateUser, searchParkingSpot);
router.post("/book", authenticateUser, bookParkingSpot);

module.exports = router;
