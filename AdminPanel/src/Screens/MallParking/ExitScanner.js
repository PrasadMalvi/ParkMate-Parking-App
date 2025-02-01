import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

const ExitScanner = () => {
  const handleBarCodeScanned = ({ type, data }) => {
    Alert.alert("QR Code Scanned", `Scanned data: ${data}`);
    // Call stopParkingSession(data) function to stop the timer and calculate price
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Exit Scanner</Text>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default ExitScanner;
