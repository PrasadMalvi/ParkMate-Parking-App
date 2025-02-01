const ParkingSpot = require("../../Models/ParkingSpot");
const mongoose = require("mongoose");
const AdvanceBooking = require("../../Models/AdvanceBook"); // Assuming AdvanceBooking model exists
const AdminModel = require("../../models/AdminModel");

// Create a new parking spot
const createParkingSpot = async (req, res) => {
  try {
    const {
      locationName,
      fullAddress,
      latitude,
      longitude,
      timeSlots,
      vehicleTypes,
    } = req.body;

    if (
      !locationName ||
      !fullAddress ||
      latitude === undefined ||
      longitude === undefined ||
      !timeSlots ||
      !vehicleTypes
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newSpot = new ParkingSpot({
      locationName,
      fullAddress,
      latitude,
      longitude,
      timeSlots,
      vehicleTypes,
      createdBy: req.user.id, // Associate with the user
    });

    await newSpot.save();
    return res
      .status(201)
      .json({ success: true, message: "Parking spot created", data: newSpot });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating parking spot",
      error: error.message,
    });
  }
};

// Update an existing parking spot
const updateParkingSpot = async (req, res) => {
  try {
    const {
      locationName,
      fullAddress,
      latitude,
      longitude,
      vehicleTypes,
      timeSlots,
    } = req.body;

    const updatedSpot = await ParkingSpot.findByIdAndUpdate(
      req.params.id,
      {
        locationName,
        fullAddress,
        latitude,
        longitude,
        vehicleTypes,
        timeSlots,
      },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedSpot) {
      return res
        .status(404)
        .json({ success: false, message: "Parking spot not found" });
    }

    return res.json({
      success: true,
      message: "Parking spot updated",
      data: updatedSpot,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating parking spot",
      error: error.message,
    });
  }
};

// Get a parking spot by ID
const getParkingSpotById = async (req, res) => {
  try {
    const spot = await ParkingSpot.findById(req.params.id);

    if (!spot) {
      return res
        .status(404)
        .json({ success: false, message: "Parking spot not found" });
    }

    return res.json({
      success: true,
      data: spot,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving parking spot",
      error: error.message,
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body; // Update fields as needed

    const updatedUser = await AdminModel.findByIdAndUpdate(
      req.user.id,
      { name, email, phone },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Profile updated",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// Manage AdvanceBookings
const manageBookings = async (req, res) => {
  try {
    const bookings = await AdvanceBooking.find({ userId: req.user.id });
    return res.json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

module.exports = {
  createParkingSpot,
  updateParkingSpot,
  getParkingSpotById,
  updateProfile,
  manageBookings,
};
