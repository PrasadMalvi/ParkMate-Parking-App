const express = require("express");
const {
  registerController,
  loginController,
  updateProfileController,
  getUserDataController,
  deleteAccountController,
} = require("../Controllers/UserController");
const profileImageUpload = require("../Middleware/profileImageUpload");
const authenticateUser = require("../Middleware/authMiddleware");

const router = express.Router();

// SignUp || POST
router.post("/register", registerController);

// SignIn || POST
router.post("/login", loginController);

// Update Profile || PUT
router.post("/updateprofile", authenticateUser, updateProfileController);

// Get User Data || GET
router.get("/getUserData", authenticateUser, getUserDataController);

// Upload Profile Picture || POST
router.post(
  "/upload-profile-pic",
  authenticateUser,
  profileImageUpload.single("profilePicture"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: 0, message: "No file uploaded" });
    }

    // Store only the relative path
    const imagePath = `/profile-pics/${req.file.filename}`;

    res.status(200).json({ success: 1, image_url: imagePath });
  }
);

// Delete User Account || DELETE
router.delete("/delete-account", authenticateUser, deleteAccountController);

module.exports = router;
