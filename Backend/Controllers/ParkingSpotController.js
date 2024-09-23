// parkingSpotController.js
const ParkingSpot = require("../Models/ParkingSpot");
const AdvanceBooking = require("../Models/AdvanceBook");

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

    return res.json({ success: true, data: spot });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving parking spot",
      error: error.message,
    });
  }
};

// Book a parking spot (token required)
// Book a parking spot (token required)
const bookParkingSpot = async (req, res) => {
  try {
    const { spotId, timeSlot, vehicleType } = req.body;
    const userId = req.user.id; // Assuming the user info is available in the request after authentication

    // Find the parking spot
    const spot = await ParkingSpot.findById(spotId);

    if (!spot) {
      return res
        .status(404)
        .json({ success: false, message: "Parking spot not found" });
    }

    // Find the correct time slot
    const slot = spot.timeSlots.find(
      (ts) =>
        ts.startTime === timeSlot.startTime && ts.endTime === timeSlot.endTime
    );

    if (!slot) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid time slot" });
    }

    // Check if there are available slots for the selected vehicle type
    const vehicleTypeData = spot.vehicleTypes.find(
      (v) => v.type === vehicleType
    );

    if (!vehicleTypeData || vehicleTypeData.maxSlots <= 0) {
      return res.status(400).json({
        success: false,
        message: "No available slots for this vehicle type",
      });
    }

    // Decrement the available slots for the specific time slot
    slot.maxSlots -= 1;

    // If maxSlots reaches zero, mark the slot as booked
    if (slot.maxSlots === 0) {
      slot.isBooked = true;
    }

    // Save the updated parking spot
    await spot.save();

    // Create an entry in the AdvanceBooking collection
    const newBooking = new AdvanceBooking({
      user: userId,
      spot: spotId,
      bookingDate: new Date().toISOString().split("T")[0], // Current date
      bookingTime: `${slot.startTime} - ${slot.endTime}`,
      vehicleType: vehicleType,
    });

    await newBooking.save(); // Save the booking record

    return res
      .status(200)
      .json({ success: true, message: "Booking confirmed", data: spot });
  } catch (error) {
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
