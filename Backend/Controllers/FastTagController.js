const FastTag = require("../models/FastTag");
const QRCode = require("qrcode");
const FastTagSession = require("../models/FastTagSession");
const mongoose = require("mongoose");

// Create a new FastTag
const createFastTag = async (req, res) => {
  try {
    const { name, location, price, address } = req.body;

    if (!name || !location || !price || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const fastTag = new FastTag({ name, location, price, address });
    await fastTag.save();
    res.status(201).json(fastTag);
  } catch (error) {
    res.status(500).json({ message: "Error creating FastTag", error });
  }
};

// Fetch all FastTags
const fetchFastTags = async (req, res) => {
  try {
    const { name } = req.query;
    const query = name ? { name: { $regex: name, $options: "i" } } : {};
    const fastTags = await FastTag.find(query);
    res.status(200).json(fastTags);
  } catch (error) {
    res.status(500).json({ message: "Error fetching FastTags", error });
  }
};

// controllers/fastTagController.js
const getFastTagHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await FastTagTransaction.find({ userId });
    res.json(history);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to fetch FastTag history",
        error: error.message,
      });
  }
};

// View FastTag details
const viewFastTagDetails = async (req, res) => {
  try {
    const fastTag = await FastTag.findById(req.params.id);
    if (!fastTag) {
      return res.status(404).json({ message: "FastTag not found" });
    }
    res.status(200).json(fastTag);
  } catch (error) {
    res.status(500).json({ message: "Error fetching FastTag details", error });
  }
};

// Generate QR code for FastTag
const generateFastTagQRCode = async (req, res) => {
  try {
    const { fastTagId } = req.params;
    const { vehicleId } = req.body;

    if (!fastTagId || !vehicleId) {
      return res
        .status(400)
        .json({ message: "FastTag ID and Vehicle ID are required" });
    }

    const fastTag = await FastTag.findById(fastTagId);
    if (!fastTag) {
      return res.status(404).json({ message: "FastTag not found" });
    }

    const existingSession = await FastTagSession.findOne({
      vehicleId,
      fastTagId,
      status: "active",
    });

    if (existingSession) {
      return res.json({
        message: "Existing QR Code found",
        qrCodeUrl: existingSession.qrCodeUrl,
      });
    }

    const qrCodeUrl = await QRCode.toDataURL(`${fastTagId}-${vehicleId}`);
    const newSession = new FastTagSession({
      fastTagId,
      vehicleId,
      qrCodeUrl,
      status: "active",
    });

    await newSession.save();
    res.json({ message: "QR Code generated", qrCodeUrl });
  } catch (error) {
    console.error("Error generating QR Code:", error);
    res
      .status(500)
      .json({ message: "Failed to generate QR Code", error: error.message });
  }
};

// Exit parking and calculate price
const exitFastTagScanner = async (req, res) => {
  try {
    const { qrCode } = req.params;
    const fastTagSession = await FastTagSession.findOne({ qrCodeUrl: qrCode });

    if (!fastTagSession || fastTagSession.status !== "active") {
      return res
        .status(404)
        .json({ message: "Invalid or inactive parking session" });
    }

    fastTagSession.status = "completed";
    await fastTagSession.save();

    res.json({ message: "Parking session ended" });
  } catch (error) {
    res.status(500).json({ message: "Failed to exit fasttag", error });
  }
};

// Get existing FastTag QR Code
const getExistingFastTagQRCode = async (req, res) => {
  try {
    const { fastTagId, vehicleId } = req.params;

    const fastTagObjectId = new mongoose.Types.ObjectId(fastTagId);
    const vehicleObjectId = new mongoose.Types.ObjectId(vehicleId);

    const existingSession = await FastTagSession.findOne({
      fastTagId: fastTagObjectId,
      vehicleId: vehicleObjectId,
      status: "active",
    }).select("qrCodeUrl");

    if (existingSession) {
      return res.json({ qrCodeUrl: existingSession.qrCodeUrl });
    } else {
      return res
        .status(404)
        .json({ message: "No active FastTag session found" });
    }
  } catch (error) {
    console.error("Error fetching existing QR code:", error);
    return res.status(500).json({
      message: "Failed to fetch existing QR Code",
      error: error.message,
    });
  }
};

// Export the controller functions
module.exports = {
  createFastTag,
  fetchFastTags,
  viewFastTagDetails,
  generateFastTagQRCode,
  exitFastTagScanner,
  getExistingFastTagQRCode,
  getFastTagHistory,
};
