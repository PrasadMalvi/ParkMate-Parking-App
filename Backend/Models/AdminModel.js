const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  adminType: {
    type: String,
    enum: ["AdvanceBook", "MallPark", "FastTag"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model already exists in mongoose.models
const AdminModel =
  mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

module.exports = AdminModel;
