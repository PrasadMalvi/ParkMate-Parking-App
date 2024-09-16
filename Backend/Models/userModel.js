const mongoose = require("mongoose");

const Users = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please Enter Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Enter Password"],
      min: 8,
      max: 64,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", Users);
