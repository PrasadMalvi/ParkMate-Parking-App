const MallParking = require("../../Models/MallParkingModel");
const ParkingSession = require("../../Models/MallParkingSession");
const { calculateParkingPrice } = require("../../Utils/CalculatedPrice");

const addMall = async (req, res) => {
  try {
    const { name, location, address, pricing } = req.body;

    // Validation: Check if all required fields are provided
    if (!name || !location || !address || pricing.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new mall parking entry
    const mall = new MallParking({
      name,
      location,
      address,
      pricing,
    });

    await mall.save();

    return res.status(201).json({ message: "Mall added successfully", mall });
  } catch (error) {
    console.error("Error adding mall:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const startParkingTimer = async (req, res) => {
  try {
    const { qrCode } = req.params;
    const parkingSession = await ParkingSession.findOne({ qrCodeUrl: qrCode });

    if (!parkingSession) {
      return res.status(404).json({ message: "Invalid QR Code" });
    }

    parkingSession.startTime = new Date();
    parkingSession.status = "active";
    await parkingSession.save();

    res.json({
      message: "Parking timer started",
      startTime: parkingSession.startTime,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to start parking session", error });
  }
};

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

    res.json({ message: "Parking session ended", duration, price });
  } catch (error) {
    res.status(500).json({ message: "Failed to exit parking session", error });
  }
};

const getMallParkingHistory = async (req, res) => {
  try {
    const { mallId } = req.params;
    const history = await ParkingSession.find({ mallId }).populate("mallId");
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch parking history", error });
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

module.exports = {
  addMall,
  startParkingTimer,
  exitParkingScanner,
  getMallParkingHistory,
  getMallParkingDetails,
};
