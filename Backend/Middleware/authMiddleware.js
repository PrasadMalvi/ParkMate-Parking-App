const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const authenticateUser = async (req, res, next) => {
  // Log the authorization header to debug

  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, token missing" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists in the database
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized, user not found" });
    }

    // Attach user to request and proceed to next middleware
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, invalid token" });
  }
};

module.exports = authenticateUser;
