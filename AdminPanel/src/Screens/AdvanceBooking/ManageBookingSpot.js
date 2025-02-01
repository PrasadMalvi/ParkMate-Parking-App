// src/Screens/Home/ManageBookings.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ManageBookings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Bookings</Text>
      <Text style={styles.description}>
        This feature allows you to manage your bookings.
      </Text>
      {/* Add your management functionalities here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default ManageBookings;
