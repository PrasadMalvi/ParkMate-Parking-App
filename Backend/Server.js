const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./Config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/auth", require("./Routes/UserRoutes"));
app.use("/parking", require("./Routes/ParkingRoute")); // Added parking route

// Define the port
const PORT = process.env.PORT || 5051;

// Start the server
app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`.bgGreen.white);
});
