const express = require("express");
const router = express.Router();
const {
  addMall,
  getMallParkingDetails,
  startParkingTimer,
  exitParkingScanner,
  getMallParkingHistory,
} = require("../../Controllers/AdminController/AdminMallParkingController");
const authenticateUser = require("../../Middleware/AdminMiddlware");

router.post("/add", addMall);
router.get("/parking/:mallId", authenticateUser, getMallParkingDetails);
router.post("/scan/start/:qrCode", authenticateUser, startParkingTimer);
router.post("/scan/exit/:qrCode", authenticateUser, exitParkingScanner);
router.get("/history/:mallId", authenticateUser, getMallParkingHistory);

module.exports = router;
