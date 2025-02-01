const jwt = require("jsonwebtoken");
const AdminModel = require("../Models/AdminModel");

const authenticateAdmin = (requiredAdminType) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

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
      const user = await AdminModel.findById(decoded._id).select("-password");

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized, user not found" });
      }

      // Check if user is of the required admin type
      if (user.adminType !== requiredAdminType) {
        return res.status(403).json({
          success: false,
          message: "Forbidden, insufficient privileges",
        });
      }

      req.user = user; // Attach user to request
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized, invalid token" });
    }
  };
};

module.exports = authenticateAdmin;
