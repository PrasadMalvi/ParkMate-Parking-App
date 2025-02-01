import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"; // Import FontAwesome
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

const ParkingLocationScreen = () => {
  const [location, setLocation] = useState(null);
  const [markerLocation, setMarkerLocation] = useState(null);
  const [isLocationSaved, setIsLocationSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedback, setFeedback] = useState(""); // For feedback selection
  const [specificFeedback, setSpecificFeedback] = useState(""); // For specific options
  const [state] = useContext(AuthContext);
  const navigation = useNavigation();
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          setIsLoading(false);
          return;
        }

        const isEnabled = await Location.hasServicesEnabledAsync();
        if (!isEnabled) {
          Alert.alert("Location services are not enabled. Please enable them.");
          setIsLoading(false);
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
          timeout: 10000,
        });

        const { latitude, longitude } = userLocation.coords;
        setLocation({ latitude, longitude });
        setMarkerLocation({ latitude, longitude });
        setIsLoading(false);
      } catch (error) {
        console.error("Location error:", error);
        Alert.alert(
          "Error",
          "Current location is unavailable. Please try again."
        );
        setIsLoading(false);
      }
    };

    getLocation();
  }, []);

  const handleMarkerDragEnd = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerLocation({ latitude, longitude });
    setIsLocationSaved(false);
  };

  const handleConfirmParking = () => {
    setFeedbackModalVisible(true); // Open feedback modal
  };

  const handleFeedbackSubmit = async () => {
    if (markerLocation) {
      try {
        setIsSaving(true);
        const { token } = state;

        const response = await axios.post(
          "/parking/feedback",
          {
            latitude: markerLocation.latitude,
            longitude: markerLocation.longitude,
            feedback: feedback, // Safety option
            specificFeedback: specificFeedback, // Additional feedback
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Response from server:", response.data); // Log the response
        Alert.alert("Feedback Submitted", "Thank you for your feedback!");
        setIsLocationSaved(true);
        setFeedbackModalVisible(false);
        navigation.navigate("ParkingHistory");
      } catch (error) {
        console.error(
          "Error during feedback submission:",
          error.response ? error.response.data : error.message
        );
        Alert.alert("Error", "Failed to submit feedback.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={30} color="#096c90" />
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            showsUserLocation={true}
            followsUserLocation={true}
            initialRegion={{
              ...location,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {markerLocation && (
              <Marker
                coordinate={markerLocation}
                draggable
                onDragEnd={handleMarkerDragEnd}
                title="Your Vehicle"
              />
            )}
          </MapView>

          <TouchableOpacity
            onPress={handleConfirmParking}
            disabled={isLocationSaved || isSaving}
            style={[
              styles.parkButton,
              { opacity: isLocationSaved || isSaving ? 0.5 : 1 },
            ]}
          >
            <Text style={styles.buttonText}>
              {isLocationSaved
                ? "Location Saved"
                : isSaving
                ? "Saving..."
                : "Park Here"}
            </Text>
          </TouchableOpacity>

          {/* Feedback Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={feedbackModalVisible}
            onRequestClose={() => setFeedbackModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Feedback on Parking</Text>
                <Picker
                  selectedValue={feedback}
                  style={styles.picker}
                  onValueChange={(itemValue) => setFeedback(itemValue)}
                >
                  <Picker.Item label="Select Safety Level" value="" />
                  <Picker.Item label="Safe to Park" value="safe" />
                  <Picker.Item label="Not Safe to Park" value="not_safe" />
                </Picker>

                {feedback === "not_safe" && (
                  <Picker
                    selectedValue={specificFeedback}
                    style={styles.picker}
                    onValueChange={(itemValue) =>
                      setSpecificFeedback(itemValue)
                    }
                  >
                    <Picker.Item label="Select Reason" value="" />
                    <Picker.Item
                      label="Private Property"
                      value="private_property"
                    />
                    <Picker.Item
                      label="Traffic Police"
                      value="traffic_police"
                    />
                    <Picker.Item
                      label="No Parking Zone"
                      value="no_parking_zone"
                    />
                  </Picker>
                )}

                <TouchableOpacity
                  onPress={handleFeedbackSubmit}
                  style={styles.submitButton}
                >
                  <Text style={styles.buttonText}>Submit Feedback</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setFeedbackModalVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "90%", height: "82%" },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#021218",
    marginTop: -50,
    marginLeft: -20,
  },
  parkButton: {
    height: 50,
    width: 110,
    borderRadius: 15,
    backgroundColor: "#1b262f",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 240,
    marginTop: -80,
  },
  buttonText: {
    fontSize: 18,
    color: "#096c90",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#1b262f",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    marginTop: 10,
    alignItems: "center",
  },
});

export default ParkingLocationScreen;
