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

const ViewFastTagQRCode = ({ route }) => {
  const [state] = useContext(AuthContext);
  const {
    fastTagId,
    fastAddress,
    fastTagName,
    fastTagRegistrationNumber,
    fastTagPrice,
  } = route.params;
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isQrCodeReady, setIsQrCodeReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const { token } = state;

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/vehicle/vehicles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(response.data.vehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        Alert.alert("Error fetching vehicles.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [token]);

  useEffect(() => {
    console.log("Selected Vehicle:", selectedVehicle);
    if (selectedVehicle) {
      fetchExistingFastTagQRCode();
    }
  }, [selectedVehicle]);

  const fetchExistingFastTagQRCode = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/fasttag/fasttassession/getQRCode/${fastTagId}/${selectedVehicle}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.qrCodeUrl) {
        setQrCodeUrl(response.data.qrCodeUrl);
        setIsQrCodeReady(true);
      } else {
        setQrCodeUrl(""); // Reset QR code if none exists
        setIsQrCodeReady(false);
        Alert.alert("No QR code found for this mall.");
      }
    } catch (error) {
      console.error("Error fetching existing QR code:", error);
      Alert.alert("Error fetching existing QR code.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFasttagQRCode = async () => {
    if (!selectedVehicle) {
      Alert.alert("Please select a vehicle");
      return;
    }

    try {
      setLoading(true); // Start loading
      console.log("Selected Vehicle ID:", selectedVehicle); // Log the selected vehicle ID
      console.log("FastTag ID:", fastTagId); // Log the FastTag ID

      const response = await axios.post(
        `http://192.168.0.101:5050/fasttag/generateQRCode/${fastTagId}`, // Full URL here
        { vehicleId: selectedVehicle }, // Ensure vehicleId is sent
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Response Data:", response.data); // Log the response for debugging
      setQrCodeUrl(response.data.qrCodeUrl);
      setIsQrCodeReady(true); // Allow QR code to be viewed
    } catch (error) {
      console.error("Error generating QR Code:", error); // Log the error
      Alert.alert(
        "Failed to generate QR Code",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleQRCodePress = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{fastTagName}</Text>
      <Text style={styles.address}>{fastAddress}</Text>
      <Text style={styles.address}>
        Registration Number: {fastTagRegistrationNumber}
      </Text>
      <Text style={styles.address}>Price: ₹{fastTagPrice}</Text>

      <Text style={styles.vehicleTitle}>Select Vehicle:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" />
      ) : vehicles.length > 0 ? (
        <Picker
          selectedValue={selectedVehicle}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setSelectedVehicle(itemValue);
            setIsQrCodeReady(false);
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

      <Button
        title="Generate QR Code"
        onPress={handleGenerateFasttagQRCode}
        color="#4A90E2"
        disabled={qrCodeUrl !== "" || loading}
      />

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
            style={!isExpanded ? styles.qrCodeSmall : styles.qrCodeHidden}
          />

          {isExpanded && (
            <Image source={{ uri: qrCodeUrl }} style={styles.qrCodeExpanded} />
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
});

export default ViewFastTagQRCode;
