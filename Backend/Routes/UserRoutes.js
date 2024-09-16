const express = require("express");
const {
  registerController,
  loginController,
} = require("../Controllers/UserController");

//Router Object

const router = express.Router();

//Routes
//SignUp || POST
router.post("/register", registerController);

//SIGNIN || POST
router.post("/login", loginController);

//Export
module.exports = router;
