const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FastTagSessionSchema = new Schema({
  vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true }, // Reference to Vehicle
  fastTagId: { type: Schema.Types.ObjectId, ref: "FastTag", required: true }, // Reference to FastTag
  qrCodeUrl: { type: String, required: true }, // URL for the FastTag QR code
  status: { type: String, default: "active" }, // 'active', 'completed'
  createdAt: { type: Date, default: Date.now }, // Timestamp when the session was created
});

// Create the model from the schema
const FastTagSession = mongoose.model("FastTagSession", FastTagSessionSchema);

// Export the model
module.exports = FastTagSession;
