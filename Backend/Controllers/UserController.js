const userModel = require("../Models/userModel");
const { hashPassword, comparePassword } = require("../Utils/Auth-Helper");
const JWT = require("jsonwebtoken");

// Sign Up
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is Required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is Required",
      });
    }
    if (!password || password.length < 8) {
      return res.status(400).send({
        success: false,
        message: "Password is Required and Should be Greater than 8",
      });
    }
    //Existing User
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User Already Exist! PLease Login",
      });
    }
    //Hashed Password
    const hashedPassword = await hashPassword(password);
    //Save User
    const user = await userModel({
      name,
      email,
      password: hashedPassword,
    }).save();
    return res.status(201).send({
      success: true,
      message: "Registration Succesfull! PLease Login",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Registration API",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please Enter Email and Password",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User Not Found",
      });
    }
    //Match Password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: true,
        message: "Invalid Username or Password",
      });
    }
    //JWT TOKEN
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "17d",
    });

    //Undefined Password
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "Login Successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Login API",
      error,
    });
  }
};
const updateProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, address, profilePicture } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        address,
        profilePicture, // Save the URL of the profile picture
      },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    res.status(200).send({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Error updating profile", error });
  }
};

// Get User Data
const getUserDataController = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have set req.user in your authentication middleware

    const user = await userModel.findById(userId).select("-password"); // Exclude password from the result

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching user data",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  updateProfileController,
  getUserDataController, // Export the new controller
};
