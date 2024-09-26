// parkingSpotController.js
const ParkingSpot = require("../Models/ParkingSpot");
const AdvanceBooking = require("../Models/AdvanceBook");
const mongoose = require("mongoose");
// Create a new parking spot (no token required)
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

// Search for parking spots by name (token required)
const searchParkingSpots = async (req, res) => {
  const { name, vehicleType } = req.query;

  try {
    const query = {
      locationName: { $regex: name, $options: "i" },
      isAvailable: true,
    };

    if (vehicleType) {
      query["vehicleTypes.type"] = vehicleType; // Adjusted to filter by vehicle type in vehicleTypes
    }

    const spots = await ParkingSpot.find(query);

    if (spots.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No parking spots found" });
    }

    return res.json({ success: true, data: spots });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error searching parking spots",
      error: error.message,
    });
  }
};

// Get a parking spot by ID (no token required)
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
      data: spot, // Ensure the entire parking spot object is sent, including timeSlots
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving parking spot",
      error: error.message,
    });
  }
};

const bookParkingSpot = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start transaction to ensure atomicity

  try {
    const { spotId, timeSlot, vehicleType } = req.body;
    const userId = req.user.id;

    // Step 1: Find the parking spot
    const spot = await ParkingSpot.findById(spotId).session(session);
    if (!spot) {
      await session.abortTransaction(); // Rollback if spot is not found
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Parking spot not found" });
    }

    // Step 2: Find the correct time slot
    const slot = spot.timeSlots.find(
      (ts) =>
        ts.startTime === timeSlot.startTime && ts.endTime === timeSlot.endTime
    );

    if (!slot) {
      await session.abortTransaction(); // Rollback if invalid time slot
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Invalid time slot" });
    }
    // Map vehicle type to maxSlots key
    const vehicleTypeMap = {
      "two-wheeler": "twoWheeler",
      "four-wheeler": "fourWheeler",
      other: "other",
    };
    const maxSlotsKey = vehicleTypeMap[vehicleType];
    // Step 3: Check the available slots for the selected vehicle type
    console.log("Available slots Before booking:", slot.maxSlots[maxSlotsKey]);

    // Check if the selected vehicle type has available slots
    if (slot.maxSlots[maxSlotsKey] <= 0) {
      await session.abortTransaction(); // Rollback if no available slots
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "No available slots for this vehicle type",
      });
    }

    // Step 4: Decrement the available slots

    slot.maxSlots[maxSlotsKey] -= 1;
    console.log("Available slots after booking:", slot.maxSlots[maxSlotsKey]);

    // Update the timeSlots array in the ParkingSpot document
    const updatedTimeSlots = spot.timeSlots.map((ts) => {
      if (
        ts.startTime === timeSlot.startTime &&
        ts.endTime === timeSlot.endTime
      ) {
        return slot;
      }
      return ts;
    });

    spot.timeSlots = updatedTimeSlots;

    // Save the updated parking spot
    await spot.save({ session });

    // Step 5: Mark slot as booked if necessary
    if (slot.maxSlots[maxSlotsKey] === 0) {
      spot.timeSlots = spot.timeSlots.map((ts) => {
        if (
          ts.startTime === timeSlot.startTime &&
          ts.endTime === timeSlot.endTime
        ) {
          ts.isBooked = true;
        }
        return ts;
      });
    }

    // Step 6: Save the updated parking spot
    await spot.save({ session });
    console.log("Parking spot updated successfully");

    // Step 7: Create the booking
    const newBooking = new AdvanceBooking({
      user: userId,
      spot: spotId,
      bookingDate: new Date().toISOString().split("T")[0],
      bookingTime: `${slot.startTime} - ${slot.endTime}`,
      vehicleType: vehicleType,
    });

    await newBooking.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json({ success: true, message: "Booking confirmed", data: spot });
  } catch (error) {
    console.error("Error during booking:", error);
    await session.abortTransaction(); // Abort transaction in case of error
    session.endSession();

    return res.status(500).json({
      success: false,
      message: "Error booking parking spot",
      error: error.message,
    });
  }
};
// Fetch the advance booking history for the authenticated user
const getAdvanceBookingHistory = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user's ID

    // Find all bookings made by the authenticated user
    const bookings = await AdvanceBooking.find({ user: userId }).populate(
      "spot"
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No advance booking history found for this user",
      });
    }

    return res.json({
      success: true,
      message: "Advance booking history retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching advance booking history",
      error: error.message,
    });
  }
};

module.exports = {
  createParkingSpot,
  searchParkingSpots,
  getParkingSpotById,
  bookParkingSpot,
  getAdvanceBookingHistory,
};
