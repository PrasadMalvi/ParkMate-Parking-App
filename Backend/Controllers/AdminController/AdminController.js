const Admin = require("../../models/AdminModel");
const ParkingSpot = require("../../Models/ParkingSpot");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Register Admin
const registerAdmin = async (req, res) => {
  const { name, email, password, adminType } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Validate admin type
    if (!["AdvanceBook", "MallPark", "FastTag"].includes(adminType)) {
      return res.status(400).json({ message: "Invalid admin type" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    admin = new Admin({ name, email, password: hashedPassword, adminType });
    await admin.save();

    const payload = { admin: { id: admin.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, message: "Admin registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const payload = { admin: { id: admin.id, adminType: admin.adminType } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Create a redirect URL based on the admin type
    const redirectUrl = getRedirectUrl(admin.adminType);

    res.json({
      token,
      adminType: admin.adminType,
      redirectUrl, // Send the redirect URL back
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Function to determine redirect URL based on admin type
const getRedirectUrl = (adminType) => {
  switch (adminType) {
    case "AdvanceBook":
      return "/admin/advance-booking-dashboard";
    case "MallPark":
      return "/admin/mall-parking-dashboard";
    case "FastTag":
      return "/admin/fast-tag-dashboard";
    default:
      return "/";
  }
};

// Update Profile
const updateProfileController = async (req, res) => {
  const { name, email, adminType } = req.body; // Assuming you want to update these fields
  const adminId = req.admin.id; // Assuming you have set req.admin in your authentication middleware

  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { name, email, adminType },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ success: true, admin: updatedAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// Get User Data
const getUserDataController = async (req, res) => {
  const adminId = req.admin.id; // Assuming you have set req.admin in your authentication middleware

  try {
    const admin = await Admin.findById(adminId).select("-password"); // Exclude password from the result

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ success: true, admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching admin data" });
  }
};

// Upload Profile Picture
const uploadProfilePic = (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  const imageUrl = `http://localhost:5050/profile-pics/${req.file.filename}`; // Change to your server's IP
  res.status(200).json({ success: true, image_url: imageUrl });
};

/// Export the controllers
module.exports = {
  registerAdmin,
  loginAdmin,
  updateProfileController,
  getUserDataController,
  uploadProfilePic,
};
