const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MallParkingSessionSchema = new Schema({
  vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
  mallId: { type: Schema.Types.ObjectId, ref: "MallParking", required: true },
  qrCodeUrl: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date }, // Exit time will be updated when the exit QR code is scanned
  duration: { type: Number }, // Parking duration in minutes
  price: { type: Number }, // Calculated price after exit scan
  status: { type: String, default: "active" }, // 'active', 'completed'
  createdAt: { type: Date, default: Date.now },
});

const ParkingSession = mongoose.model(
  "MallParkingSession",
  MallParkingSessionSchema
);
module.exports = ParkingSession;
