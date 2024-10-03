const express = require("express");
const router = express.Router();
const {
  createVehicle,
  getVehiclesByUser,
  getVehicleByRegistrationNumber,
} = require("../controllers/vehicleController");
const authenticateUser = require("../Middleware/authMiddleware");

// Route to add a vehicle
router.post("/addvehicle", authenticateUser, createVehicle);

// Route to fetch all vehicles for a user with pagination
router.get("/vehicles", authenticateUser, getVehiclesByUser);

// Route to fetch vehicle by registration number
router.get(
  "/vehicle/:registrationNumber",
  authenticateUser,
  getVehicleByRegistrationNumber
);

module.exports = router;
