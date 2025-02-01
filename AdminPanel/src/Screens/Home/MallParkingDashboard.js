import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const MallParkingDashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mall Parking Dashboard</Text>

      {/* Add Mall Details */}
      <Button
        title="Add Mall Details"
        onPress={() => navigation.navigate("AddMallDetails")}
        style={styles.button}
      />

      {/* Entry Scanner */}
      <Button
        title="Entry Scanner"
        onPress={() => navigation.navigate("EntryScanner")}
        style={styles.button}
      />

      {/* Exit Scanner */}
      <Button
        title="Exit Scanner"
        onPress={() => navigation.navigate("ExitScanner")}
        style={styles.button}
      />

      {/* Parking History */}
      <Button
        title="Parking History"
        onPress={() => navigation.navigate("ParkingHistory")}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    marginVertical: 10,
  },
});

export default MallParkingDashboard;
