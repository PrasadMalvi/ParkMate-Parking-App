const Vehicle = require("../models/vehicleModel");

// Create new vehicle
const createVehicle = async (req, res) => {
  try {
    // Extract userId from the authenticated user
    const userId = req.user._id; // Correctly getting user ID from the authenticated user

    const {
      registrationNumber,
      ownerName,
      model,
      registrationDate,
      state,
      vehicleType,
      color,
      engineNumber,
    } = req.body;

    // Check if the user already has a vehicle with the same registration number
    const vehicleExists = await Vehicle.findOne({ userId, registrationNumber });
    if (vehicleExists) {
      return res.status(400).json({
        message:
          "Vehicle already exists with this registration number for this user.",
      });
    }

    // Check if a vehicle with the same engine number already exists for this user
    const engineExists = await Vehicle.findOne({ userId, engineNumber });
    if (engineExists) {
      return res.status(400).json({
        message:
          "Vehicle already exists with this engine number for this user.",
      });
    }

    // Create a new vehicle entry
    const newVehicle = new Vehicle({
      userId,
      registrationNumber,
      ownerName,
      model,
      registrationDate,
      state,
      vehicleType,
      color,
      engineNumber,
    });

    await newVehicle.save();
    return res.status(201).json({
      message: "Vehicle added successfully",
      vehicle: newVehicle,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error adding vehicle:", error);

    return res.status(500).json({
      error: "Error adding vehicle",
      details: error.message,
    });
  }
};

// Fetch vehicles by user ID with optional pagination
const getVehiclesByUser = async (req, res) => {
  try {
    // Extract userId from the authenticated user
    const userId = req.user._id; // Correctly getting user ID from the authenticated user

    const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10

    // Fetch vehicles for the authenticated user
    const vehicles = await Vehicle.find({ userId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Vehicle.countDocuments({ userId });

    return res.status(200).json({
      vehicles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error fetching vehicles", details: error.message });
  }
};

// Fetch a single vehicle by registration number
const getVehicleByRegistrationNumber = async (req, res) => {
  try {
    const registrationNumber = req.params.registrationNumber;
    const vehicle = await Vehicle.findOne({ registrationNumber });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.status(200).json(vehicle);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error fetching vehicle", details: error.message });
  }
};

module.exports = {
  createVehicle,
  getVehiclesByUser,
  getVehicleByRegistrationNumber,
};
