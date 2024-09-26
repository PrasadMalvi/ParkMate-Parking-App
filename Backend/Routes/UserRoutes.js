const express = require("express");
const {
  registerController,
  loginController,
  updateProfileController,
  getUserDataController,
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

    const imageUrl = `http://192.168.0.101:5050/profile-pics/${req.file.filename}`;
    res.status(200).json({ success: 1, image_url: imageUrl });
  }
);

// Export router
module.exports = router;
