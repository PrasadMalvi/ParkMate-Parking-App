// Controllers/MallParkingController.js
const MallParking = require("../Models/MallParkingModel");

// Create new mall parking entry
const createMallParking = async (req, res) => {
  const { mallName, entryQRCode, exitQRCode, pricing } = req.body;

  try {
    const newMallParking = await MallParking.create({
      mallName,
      entryQRCode,
      exitQRCode,
      pricing,
    });
    return res.status(201).json({ success: true, data: newMallParking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Scan entry QR code
const scanEntryQRCode = async (req, res) => {
  const { qrCode } = req.body; // Assuming you send QR code in body

  try {
    const mallParking = await MallParking.findOne({ entryQRCode: qrCode });

    if (!mallParking) {
      return res
        .status(404)
        .json({ success: false, message: "Mall not found!" });
    }

    // Start timer logic can go here, save user parking session in DB

    return res.status(200).json({ success: true, data: mallParking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Scan exit QR code
const scanExitQRCode = async (req, res) => {
  const { qrCode } = req.body; // Assuming you send QR code in body

  try {
    const mallParking = await MallParking.findOne({ exitQRCode: qrCode });

    if (!mallParking) {
      return res
        .status(404)
        .json({ success: false, message: "Mall not found!" });
    }

    // Calculate time spent, deduct price from wallet or prompt for payment

    return res.status(200).json({ success: true, message: "Exit processed!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createMallParking,
  scanEntryQRCode,
  scanExitQRCode,
};
