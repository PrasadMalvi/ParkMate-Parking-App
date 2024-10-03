import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import moment from "moment"; // For formatting time and calculating duration

const QRCodeScreen = ({ route }) => {
  const [state] = useContext(AuthContext);
  const { mallId, mallName, vehicleId, mallAddress, mallPricing } =
    route.params;
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isQrCodeReady, setIsQrCodeReady] = useState(false);
  const { token } = state;

  // Timer state
  const [timer, setTimer] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(null);

  // In QRCodeScreen.js
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`/vehicle/vehicles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(response.data.vehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        Alert.alert("Error fetching vehicles.");
      }
    };

    fetchVehicles();
  }, [token]);

  useEffect(() => {
    if (selectedVehicle) {
      fetchExistingQRCode(); // Fetch QR code only when a vehicle is selected
    }
  }, [selectedVehicle]);

  const fetchExistingQRCode = async () => {
    try {
      const response = await axios.get(
        `/mallparking/parkingsession/qrcode/${mallId}/${selectedVehicle}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.qrCodeUrl) {
        setQrCodeUrl(response.data.qrCodeUrl);
        setIsQrCodeReady(true);
        setStartTime(
          response.data.startTime ? new Date(response.data.startTime) : null
        );
      } else {
        setQrCodeUrl(""); // Reset QR code if none exists
        setIsQrCodeReady(false);
        Alert.alert("No QR code found for this mall.");
      }
    } catch (error) {
      console.error("Error fetching existing QR code:", error);
      if (error.response && error.response.status === 500) {
        Alert.alert("Internal Server Error");
      } else {
        Alert.alert("Error fetching existing QR code.");
      }
    }
  };

  // Timer calculation function
  const calculateDuration = (start) => {
    const now = moment();
    const startMoment = moment(start);
    const diffInMinutes = now.diff(startMoment, "minutes");
    setDuration(diffInMinutes);
  };

  const handleGenerateQRCode = async () => {
    if (!selectedVehicle) {
      Alert.alert("Please select a vehicle");
      return;
    }

    try {
      const response = await axios.post(
        `/mallparking/generate-qrcode/${mallId}`,
        { vehicleId: selectedVehicle },
        { headers: { Authorization: `Bearer ${token}` } }
      ); // Generate QR Code for the selected vehicle and mall
      setQrCodeUrl(response.data.qrCodeUrl);
      setIsQrCodeReady(true); // Allow QR code to be viewed
      setStartTime(new Date()); // Set start time when QR code is generated
    } catch (error) {
      Alert.alert("Failed to generate QR Code");
    }
  };

  // Start the parking timer when the entry QR code is scanned
  const startParkingTimer = () => {
    if (!startTime) return;

    setTimer(setInterval(() => calculateDuration(startTime), 60000)); // Update every minute
  };

  // Handle stopping the parking when the exit QR code is scanned
  const handleStopParking = async () => {
    try {
      const response = await axios.post(
        `/mallparking/scan/exit/${qrCodeUrl}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Stop the timer and clear interval
      clearInterval(timer);
      setTimer(null);

      // Duration and price would be handled by the API response
      const { duration, price } = response.data;
      setDuration(duration);

      Alert.alert(
        "Parking session ended",
        `Duration: ${duration} minutes\n Price: ₹${price}`
      );
    } catch (error) {
      Alert.alert("Failed to stop parking");
    }
  };

  const handleVehicleSelection = (itemValue) => {
    setSelectedVehicle(itemValue);
    setIsQrCodeReady(false); // Reset QR code when vehicle is changed
  };

  const handleQRCodePress = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Mall details */}
      <Text style={styles.title}>{mallName}</Text>
      <Text style={styles.address}>{mallAddress}</Text>

      {/* Pricing details */}
      <Text style={styles.pricingTitle}>Pricing:</Text>
      {mallPricing.map((item, index) => (
        <Text key={index} style={styles.pricingText}>
          {item.duration} min: ₹{item.price}
        </Text>
      ))}

      {/* Vehicle selection */}
      <Text style={styles.vehicleTitle}>Select Vehicle:</Text>
      {vehicles.length > 0 ? (
        <Picker
          selectedValue={selectedVehicle}
          style={styles.picker}
          onValueChange={handleVehicleSelection}
        >
          <Picker.Item label="Select your vehicle" value={null} />
          {vehicles.map((vehicle) => (
            <Picker.Item
              key={vehicle._id}
              label={`${vehicle.model} - ${vehicle.registrationNumber}`}
              value={vehicle._id}
            />
          ))}
        </Picker>
      ) : (
        <Text style={styles.noVehiclesText}>No vehicles available</Text>
      )}

      {/* Generate QR Code button */}
      <Button
        title="Generate QR Code"
        onPress={handleGenerateQRCode}
        color="#4A90E2"
        disabled={qrCodeUrl !== ""} // Only disable if a QR code already exists
      />

      {/* Display QR Code if available */}
      {qrCodeUrl ? (
        <TouchableOpacity
          onPress={handleQRCodePress}
          style={styles.qrContainer}
        >
          <Text style={styles.tapText}>
            Tap to {isExpanded ? "hide" : "view"} QR Code
          </Text>
          <Image
            source={{ uri: qrCodeUrl }}
            style={isExpanded ? styles.qrCodeExpanded : styles.qrCode}
          />
          {/* Display start time and timer */}
          {startTime && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                Parking started at: {moment(startTime).format("LT")}
              </Text>
              <Text style={styles.timerText}>
                Time Elapsed:{" "}
                {duration ? `${duration} minutes` : "Calculating..."}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <Text style={styles.infoText}>
          {isQrCodeReady ? "Generating QR Code..." : ""}
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#021218",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A90E2",
    textAlign: "center",
    marginVertical: 10,
  },
  address: {
    fontSize: 18,
    color: "#777",
    textAlign: "center",
    marginBottom: 15,
  },
  pricingTitle: {
    fontSize: 20,
    color: "#fff",
    marginVertical: 10,
  },
  pricingText: {
    fontSize: 16,
    color: "#fff",
    marginVertical: 5,
  },
  vehicleTitle: {
    fontSize: 18,
    color: "#fff",
    marginTop: 20,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#fff",
    backgroundColor: "#0a1f29",
    borderRadius: 5,
    marginBottom: 20,
  },
  noVehiclesText: {
    fontSize: 16,
    color: "#ff6666",
    marginVertical: 10,
  },
  qrContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 50,
  },
  tapText: {
    color: "#fff",
    marginBottom: 10,
  },
  qrCode: {
    width: 200,
    height: 200,
    display: "none",
  },
  qrCodeExpanded: {
    width: 200,
    height: 200,
  },
  timerContainer: {
    marginTop: 20,
  },
  timerText: {
    fontSize: 16,
    color: "#fff",
  },
  infoText: {
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
  },
});

export default QRCodeScreen;
