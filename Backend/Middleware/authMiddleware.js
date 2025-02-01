const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

  console.log("Authorization Header:", req.headers.authorization);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, token missing" });
  }

  const tokenRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
  if (!tokenRegex.test(token)) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized, invalid token structure",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Log the decoded token for debugging

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
    console.error("Token verification error:", error.message, "Token:", token);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, invalid token" });
  }
};

module.exports = authenticateUser;
