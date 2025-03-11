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
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import moment from "moment";
import ViewQRSkeleton from "../../Components/Skeletons/MallParkSkeleton";

const QRCodeScreen = ({ route }) => {
  const [state] = useContext(AuthContext);
  const { mallId, mallName, mallAddress, mallPricing } = route.params;
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isQrCodeReady, setIsQrCodeReady] = useState(false);
  const { token } = state;

  // Timer state
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // New state for elapsed time

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`/vehicle/vehicles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(response.data.vehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        Alert.alert("Error fetching vehicles.");
      } finally {
        setLoading(false); // Stop loading
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
      setLoading(true);
      const response = await axios.get(
        `/mallparking/parkingsession/qrcode/${mallId}/${selectedVehicle}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.qrCodeUrl) {
        setQrCodeUrl(response.data.qrCodeUrl);
        setIsQrCodeReady(true);
        setStartTime(
          response.data.startTime ? new Date(response.data.startTime) : null
        );
      } else {
        setQrCodeUrl(""); // Reset QR code
        setIsQrCodeReady(false);
        Alert.alert("No QR code found for this mall.");
      }
    } catch (error) {
      console.log(
        "Error fetching existing QR code:",
        error.response?.data || error.message
      );
      setQrCodeUrl(""); // Reset QR code
      setIsQrCodeReady(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQRCode = async () => {
    if (!selectedVehicle) {
      Alert.alert("Please select a vehicle");
      return;
    }

    try {
      setLoading(true); // Start loading
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
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    // Timer to calculate elapsed time
    const timerInterval = setInterval(() => {
      if (startTime) {
        const now = new Date();
        const elapsed = Math.floor((now - startTime) / 60000); // Calculate elapsed time in minutes
        setElapsedTime(elapsed);
      }
    }, 1000); // Update every second

    return () => clearInterval(timerInterval); // Clean up interval on unmount
  }, [startTime]);

  const handleQRCodePress = () => {
    setIsExpanded(!isExpanded);
  };
  if (loading) {
    return <ViewQRSkeleton />; // Render skeleton during loading
  }
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
      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" />
      ) : vehicles.length > 0 ? (
        <Picker
          selectedValue={selectedVehicle}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setSelectedVehicle(itemValue);
            setIsQrCodeReady(false); // Reset QR code when vehicle is changed
            setElapsedTime(0); // Reset elapsed time when changing vehicle
          }}
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
        disabled={qrCodeUrl !== "" || loading} // Disable if QR code already exists or loading
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

          {/* Small round QR code preview */}
          <Image
            source={{ uri: qrCodeUrl }}
            style={!isExpanded ? styles.qrCodeSmall : styles.qrCodeHidden}
          />

          {/* Full QR code on tap */}
          {isExpanded && (
            <Image source={{ uri: qrCodeUrl }} style={styles.qrCodeExpanded} />
          )}
        </TouchableOpacity>
      ) : (
        <Text style={styles.infoText}>
          {isQrCodeReady ? "Generating QR Code..." : ""}
        </Text>
      )}

      {/* Display start time and timer */}
      {startTime && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            Parking started at: {moment(startTime).format("LT")}
          </Text>
          <Text style={styles.timerText}>
            Total Duration: {elapsedTime} minutes
          </Text>
        </View>
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
    marginVertical: 20,
  },
  qrCodeSmall: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  qrCodeExpanded: {
    width: 300,
    height: 300,
    marginTop: -300,
    zIndex: 2,
  },
  qrCodeHidden: {
    display: "none",
  },
  tapText: {
    fontSize: 16,
    color: "#4A90E2",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#fff",
  },
  timerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  timerText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default QRCodeScreen;
