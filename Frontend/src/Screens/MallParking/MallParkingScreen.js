import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import FooterMenu from "../../Components/Menus/FooterMenu";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios"; // Make sure you have axios installed

const MallParkingScreen = () => {
  const [isParked, setIsParked] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeParked, setTimeParked] = useState(0); // in minutes
  const [price, setPrice] = useState(0);

  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Handle barcode scan
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    if (isParked) {
      handlePunchOut(data); // Handle exit QR code
    } else {
      handlePunchIn(data); // Handle entry QR code
    }
  };

  // Logic for punch-in
  const handlePunchIn = async (data) => {
    setIsParked(true);
    setStartTime(new Date());
    // Assuming the QR code data contains the mall ID or similar for backend
    Alert.alert(
      "Entry QR scanned!",
      "You have successfully entered the parking."
    );
  };

  // Logic for punch-out and payment
  const handlePunchOut = async (data) => {
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 60000); // Calculate duration in minutes
    setTimeParked(duration);

    // Calculate price based on duration
    const pricePer30Min = 10; // ₹10 per 30 minutes
    const totalPrice = Math.ceil(duration / 30) * pricePer30Min; // Round up to the nearest 30 minutes
    setPrice(totalPrice);

    // Logic to deduct from wallet or ask for payment
    const confirmation = await confirmPayment(totalPrice);
    if (confirmation) {
      setIsParked(false);
      setStartTime(null);
      setScanned(false);
      Alert.alert(
        "Exit QR scanned!",
        `You have successfully exited. Total cost: ₹${totalPrice}`
      );
    }
  };

  const confirmPayment = (totalPrice) => {
    return new Promise((resolve) => {
      Alert.alert(
        "Payment Required",
        `Total amount to pay: ₹${totalPrice}. Confirm?`,
        [
          {
            text: "Cancel",
            onPress: () => resolve(false),
            style: "cancel",
          },
          {
            text: "Pay",
            onPress: () => {
              // Logic to deduct from user's wallet (API call or state management)
              // For now, we will just resolve true
              resolve(true);
            },
          },
        ]
      );
    });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        {isParked ? "Vehicle is Parked" : "No Vehicle is Parked"}
      </Text>
      <Button
        title={isParked ? "Punch Out" : "Punch In"}
        onPress={isParked ? handlePunchOut : handlePunchIn}
        disabled={scanned} // Disable button while scanning
      />
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#021218" },
  status: { fontSize: 20, marginBottom: 20, color: "white" },
});

export default MallParkingScreen;
