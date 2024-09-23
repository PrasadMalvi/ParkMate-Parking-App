const mongoose = require("mongoose");

const advanceBookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    spot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSpot",
      required: true,
    },
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, required: true },
    status: { type: String, default: "Booked" },
  },
  { timestamps: true } // This adds createdAt and updatedAt fields
);

const AdvanceBooking = mongoose.model("AdvanceBooking", advanceBookingSchema);
module.exports = AdvanceBooking;
