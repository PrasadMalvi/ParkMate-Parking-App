const MallParking = require("../models/MallParking");
const QRCode = require("qrcode");
const { calculateParkingPrice } = require("../utils/mallParking");
const ParkingSession = require("../models/ParkingSessionModel");
const mongoose = require("mongoose");

// Add new mall
const addMall = async (req, res) => {
  try {
    const { name, location, address, pricing } = req.body;
    const mall = new MallParking({ name, location, address, pricing });
    await mall.save();
    res.status(201).json({ message: "Mall added successfully", mall });
  } catch (error) {
    res.status(500).json({ message: "Failed to add mall", error });
  }
};

// Get all mall details
const getMallDetails = async (req, res) => {
  try {
    const malls = await MallParking.find();
    res.json({ malls });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch mall details", error: error.message });
  }
};

// Get mall parking details
const getMallParkingDetails = async (req, res) => {
  try {
    const mallId = req.params.mallId;
    const mall = await MallParking.findById(mallId);
    if (!mall) return res.status(404).json({ message: "Mall not found" });
    res.json({ pricing: mall.pricing });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch parking details", error });
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

// Start parking timer when QR code is scanned
const startParkingTimer = async (req, res) => {
  try {
    const { qrCode } = req.params;
    const parkingSession = await ParkingSession.findOne({ qrCodeUrl: qrCode });

    if (!parkingSession)
      return res.status(404).json({ message: "Invalid QR Code" });

    if (parkingSession.status === "completed") {
      return res
        .status(400)
        .json({ message: "Parking session already ended." });
    }

    parkingSession.startTime = new Date();
    parkingSession.status = "active";
    await parkingSession.save();

    res.json({
      message: "Parking timer started",
      startTime: parkingSession.startTime,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to start parking", error });
  }
};

// Exit parking and calculate price
const exitParkingScanner = async (req, res) => {
  try {
    const { qrCode } = req.params;
    const parkingSession = await ParkingSession.findOne({ qrCodeUrl: qrCode });

    if (!parkingSession || parkingSession.status !== "active") {
      return res
        .status(404)
        .json({ message: "Invalid or inactive parking session" });
    }

    const endTime = new Date();
    const duration = (endTime - parkingSession.startTime) / 60000;

    const mall = await MallParking.findById(parkingSession.mallId);
    const price = calculateParkingPrice(mall.pricing, duration);

    parkingSession.endTime = endTime;
    parkingSession.duration = duration;
    parkingSession.price = price;
    parkingSession.status = "completed";

    await parkingSession.save();

    res.json({
      message: "Parking session ended",
      startTime: parkingSession.startTime,
      endTime: parkingSession.endTime,
      duration,
      price,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to exit parking", error });
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
  addMall,
  getMallDetails,
  getMallParkingDetails,
  generateQRCode,
  startParkingTimer,
  exitParkingScanner,
  getExistingQRCode,
};
