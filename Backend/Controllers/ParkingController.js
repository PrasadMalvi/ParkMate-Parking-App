const express = require("express");
const ParkingLocation = require("../Models/parkingLocation");
// Save parking location with feedback for the authenticated user
const saveParkingLocation = async (req, res) => {
  try {
    const user = req.user; // Get the authenticated user from middleware
    const { latitude, longitude, feedback } = req.body; // Data from client

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    const newParking = await ParkingLocation.create({
      userId: user._id, // Use the authenticated user's ID
      latitude,
      longitude,
      feedback, // Save feedback
    });

    return res.status(201).json({
      success: true,
      message: "Parking location saved successfully!",
      data: newParking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error saving parking location",
      error,
    });
  }
};

const submitParkingFeedback = async (req, res) => {
  try {
    const user = req.user; // Get the authenticated user from middleware
    const { latitude, longitude, feedback, specificFeedback } = req.body;

    console.log("Received feedback:", {
      latitude,
      longitude,
      feedback,
      specificFeedback,
    }); // Log the received data

    if (!latitude || !longitude || !feedback) {
      return res.status(400).json({
        success: false,
        message: "Please provide latitude, longitude, and feedback.",
      });
    }

    const feedbackEntry = await ParkingLocation.create({
      userId: user._id,
      latitude,
      longitude,
      feedback: {
        safetyOption: feedback,
        additionalFeedback: specificFeedback,
      },
    });

    console.log("Feedback saved:", feedbackEntry); // Log the saved feedback

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully!",
      data: feedbackEntry,
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Error submitting feedback",
      error,
    });
  }
};

// Get parking history for the authenticated user
const getParkingHistory = async (req, res) => {
  try {
    const user = req.user; // Get the authenticated user from middleware

    const parkingHistory = await ParkingLocation.find({
      userId: user._id,
    }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: "Parking history retrieved successfully!",
      data: parkingHistory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving parking history",
      error,
    });
  }
};

// Get feedback for the authenticated user
const getUserReviews = async (req, res) => {
  try {
    const user = req.user;
    const feedbacks = await ParkingLocation.find({ userId: user._id });

    return res.status(200).json({
      success: true,
      message: "User feedback retrieved successfully!",
      data: feedbacks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving feedback",
      error,
    });
  }
};

// Edit a review
const editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { feedback } = req.body; // New feedback data

    const updatedReview = await ParkingLocation.findByIdAndUpdate(
      reviewId,
      { feedback },
      { new: true } // Return the updated document
    );

    if (!updatedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Review updated successfully!",
      data: updatedReview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating review",
      error,
    });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const deletedReview = await ParkingLocation.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error deleting review",
      error,
    });
  }
};

module.exports = {
  saveParkingLocation,
  getParkingHistory,
  getUserReviews,
  editReview,
  deleteReview,
  submitParkingFeedback, // Export the feedback controller
};
