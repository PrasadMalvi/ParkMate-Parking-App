const MallParking = require("../Models/MallParkingModel");
const QRCode = require("qrcode");
const { calculateParkingPrice } = require("../Utils/CalculatedPrice");
const ParkingSession = require("../Models/MallParkingSession");
const mongoose = require("mongoose");

// Get all mall details
const getMallDetails = async (req, res) => {
  try {
    const { name } = req.query;
    const query = name ? { name: { $regex: name, $options: "i" } } : {};
    const malls = await MallParking.find(query);
    res.json({ malls });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch mall details", error: error.message });
  }
};

const generateQRCode = async (req, res) => {
  try {
    const { mallId } = req.params;
    const { vehicleId } = req.body;

    if (!mallId || !vehicleId) {
      return res
        .status(400)
        .json({ message: "Mall ID and Vehicle ID are required" });
    }

    const existingSession = await ParkingSession.findOne({
      vehicleId,
      mallId,
      exitTime: null, // Ensure no active session exists
    });

    if (existingSession) {
      return res.json({
        message: "Existing QR Code found",
        qrCodeUrl: existingSession.qrCodeUrl,
      });
    }

    const qrCodeUrl = await QRCode.toDataURL(`${mallId}-${vehicleId}`);
    const startTime = new Date();

    const newSession = new ParkingSession({
      mallId,
      vehicleId,
      qrCodeUrl,
      startTime,
    });

    await newSession.save();

    res.json({ message: "QR Code generated", qrCodeUrl, startTime });
  } catch (error) {
    console.error("Error generating QR Code:", error); // Log the actual error
    res.status(500).json({ message: "Failed to generate QR Code", error });
  }
};

// controllers/mallParkingController.js
const getMallParkingHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await ParkingSession.find({ userId }).populate("mallId"); // Assuming ParkingSession has a mallId field
    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch parking history",
      error: error.message,
    });
  }
};

const getExistingQRCode = async (req, res) => {
  try {
    const { mallId, vehicleId } = req.params;

    const mallObjectId = new mongoose.Types.ObjectId(mallId);
    const vehicleObjectId = new mongoose.Types.ObjectId(vehicleId);

    const existingSession = await ParkingSession.findOne({
      mallId: mallObjectId,
      vehicleId: vehicleObjectId,
      endTime: null, // Only look for active sessions (no exit time)
    }).select("qrCodeUrl startTime");

    if (existingSession) {
      return res.json({
        qrCodeUrl: existingSession.qrCodeUrl,
        startTime: existingSession.startTime,
      });
    } else {
      console.log("No active parking session found");
      return res
        .status(404)
        .json({ message: "No active parking session found" });
    }
  } catch (error) {
    console.error("Error fetching existing QR code:", error);
    return res.status(500).json({
      message: "Failed to fetch existing QR Code",
      error: error.message || error,
    });
  }
};

// Export functions
module.exports = {
  getMallDetails,
  generateQRCode,
  getExistingQRCode,
  getMallParkingHistory,
};
