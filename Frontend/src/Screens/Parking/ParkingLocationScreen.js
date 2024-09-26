import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

const ParkingLocationScreen = ({ token, navigation }) => {
  const [location, setLocation] = useState(null);
  const [markerLocation, setMarkerLocation] = useState(null);
  const [isLocationSaved, setIsLocationSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [state, setState] = useContext(AuthContext);

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

  const handleConfirmParking = async () => {
    if (markerLocation) {
      try {
        setIsSaving(true);
        const { token } = state;
        await axios.post(
          "/parking/parkhere",
          {
            latitude: markerLocation.latitude,
            longitude: markerLocation.longitude,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Alert.alert(
          "Parking Confirmed",
          `Vehicle parked at: Lat: ${markerLocation.latitude}, Lon: ${markerLocation.longitude}`
        );
        setIsLocationSaved(true);
        navigation.navigate("ParkingHistory");
      } catch (error) {
        Alert.alert("Error", "Failed to save parking location.");
        console.log(
          "Parking error:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={80} color="#096c90" />
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              ...location,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={markerLocation}
              draggable
              onDragEnd={handleMarkerDragEnd}
              title="Your Vehicle"
            />
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
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#021218" },
  map: { width: "100%", height: "92%" },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#021218",
  },
  parkButton: {
    height: 60,
    backgroundColor: "#096c90",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
});

export default ParkingLocationScreen;
