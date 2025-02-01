// src/Screens/Home/AdvanceBookingDashboard.js
import React, { useContext } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../../Context/AuthContext"; // Import AuthContext

const AdvanceBookingDashboard = ({ navigation }) => {
  const { logout } = useContext(AuthContext); // Access the logout function from AuthContext

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await logout(); // Call the logout function
            navigation.navigate("AdminLogin"); // Navigate back to login
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advance Booking Dashboard</Text>
      <Text style={styles.description}>
        Manage your advance bookings and parking spots here.
      </Text>
      <Button
        title="Add Parking Spot"
        onPress={() => navigation.navigate("AddParkingSpot")}
      />
      <Button
        title="Manage Bookings"
        onPress={() => navigation.navigate("ManageBookings")}
      />
      <Button
        title="AdvanceBookProfile"
        onPress={() => navigation.navigate("AdvanceBookProfile")}
      />
      <Button
        title="Logout" // Add a button for logging out
        onPress={handleLogout} // Call the handleLogout function
        color="#ff0000" // Optional: Change the button color to indicate logout
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
});

export default AdvanceBookingDashboard;
