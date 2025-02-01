import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { Camera } from "expo-camera";

const EntryScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const cameraRef = React.useRef(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanning(false); // Stop scanning after a successful scan
    Alert.alert("QR Code Scanned", `Scanned data: ${data}`);
    // Call startParkingSession(data) function to start the timer here
  };

  if (hasPermission === null) {
    return <View />; // Loading state while requesting permissions
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Entry Scanner</Text>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        onBarCodeScanned={scanning ? handleBarCodeScanned : undefined}
        barCodeScannerSettings={{
          barCodeTypes: [Camera.Constants.BarCodeType.QR], // Use 'QR' correctly here
        }}
      />
      <View style={styles.buttonContainer}>
        <Button
          title={scanning ? "Stop Scanning" : "Start Scanning"}
          onPress={() => {
            setScanning(!scanning);
            if (cameraRef.current) {
              if (scanning) {
                cameraRef.current.pausePreview(); // Pause scanning
              } else {
                cameraRef.current.resumePreview(); // Resume scanning
              }
            }
          }}
        />
      </View>
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
    color: "white", // Adjust as needed for visibility
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
});

export default EntryScanner;
