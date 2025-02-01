const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  updateProfileController,
  getUserDataController,
  uploadProfilePic,
} = require("../../Controllers/AdminController/AdminController");
const authenticateUser = require("../../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const profileImageUpload = multer({ dest: "uploads/profile-pics/" });

// SignUp || POST
router.post("/adminregister", registerAdmin);

// SignIn || POST
router.post("/adminlogin", loginAdmin);

// Update Profile || PUT
router.put("/adminupdateprofile", authenticateUser, updateProfileController);

// Get User Data || GET
router.get("/admingetUserData", authenticateUser, getUserDataController);

// Upload Profile Picture || POST
router.post(
  "/upload-profile-pic",
  authenticateUser,
  profileImageUpload.single("profilePicture"),
  uploadProfilePic // Call the uploadProfilePic function
);

// Export router
module.exports = router;
