const ParkingLocation = require("../Models/parkingLocation");

// Save parking location for the authenticated user
const saveParkingLocation = async (req, res) => {
  try {
    const user = req.user; // Get the authenticated user from middleware
    const { latitude, longitude } = req.body; // Data from client

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    const newParking = await ParkingLocation.create({
      userId: user._id, // Use the authenticated user's ID
      latitude,
      longitude,
    });

    return res.status(201).json({
      success: true,
      message: "Parking location saved successfully!",
      data: newParking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error saving parking location",
      error,
    });
  }
};

// Get parking history for the authenticated user
const getParkingHistory = async (req, res) => {
  try {
    const user = req.user; // Get the authenticated user from middleware

    const parkingHistory = await ParkingLocation.find({
      userId: user._id,
    }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: "Parking history retrieved successfully!",
      data: parkingHistory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving parking history",
      error,
    });
  }
};

module.exports = { saveParkingLocation, getParkingHistory };
