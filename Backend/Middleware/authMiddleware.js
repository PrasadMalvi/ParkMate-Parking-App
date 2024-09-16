const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from 'Authorization: Bearer <token>'

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password"); // Fetch user data without password

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized, user not found" });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized, invalid token" });
  }
};

module.exports = authenticateUser;
