const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./Config/db");
const cron = require("node-cron");
const ParkingSpot = require("./Models/ParkingSpot");
const path = require("path");
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
// Serve static files from the "profile-pics" directory
app.use("/profile-pics", express.static(path.join(__dirname, "profile-pics")));
// Routes
app.use("/auth", require("./Routes/UserRoutes"));
app.use("/parking", require("./Routes/ParkingRoute"));
app.use("/parkingspot", require("./Routes/ParkingSoptRoute"));
app.use("/mallparking", require("./Routes/MallParkingRoute"));
app.use("/vehicle", require("./Routes/VehicleRoute"));

// Define the port
const PORT = process.env.PORT || 5051;

// Cron job to reset parking spot slots
cron.schedule("0 0 * * *", async () => {
  try {
    // Find all parking spots
    const spots = await ParkingSpot.find();

    spots.forEach(async (spot) => {
      // Loop through each time slot and reset the slots for the next day
      spot.timeSlots.forEach((slot) => {
        slot.maxSlots = 10; // Reset to your desired maximum number of slots
        slot.isBooked = false; // Mark slot as available again
      });

      // Save the updated spot
      await spot.save();
      console.log(`Parking spot ${spot.locationName} slots have been reset`);
    });

    console.log("All parking spots have been reset for the day");
  } catch (error) {
    console.error("Error resetting parking spots:", error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`.bgGreen.white);
});
