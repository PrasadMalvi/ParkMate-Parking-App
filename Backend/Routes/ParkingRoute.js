const express = require("express");
const {
  saveParkingLocation,
  getParkingHistory,
  getUserReviews,
  editReview,
  deleteReview,
  submitParkingFeedback,
} = require("../Controllers/ParkingController");
const authenticateUser = require("../Middleware/authMiddleware");

const router = express.Router();

router.post("/parkhere", authenticateUser, saveParkingLocation);
router.get("/parkinghistory", authenticateUser, getParkingHistory);
router.get("/feedback/fetch", authenticateUser, getUserReviews);
router.put("/feedback/:reviewId", authenticateUser, editReview);
router.delete("/feedback/:reviewId", authenticateUser, deleteReview);
router.post("/feedback", authenticateUser, submitParkingFeedback);
module.exports = router;
