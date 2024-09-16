import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ParkingLocationScreen = () => {
  const [location, setLocation] = useState(null);
  const [markerLocation, setMarkerLocation] = useState(null);
  const [isLocationSaved, setIsLocationSaved] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    // Load JWT token from AsyncStorage
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("@auth");
      setToken(storedToken);
    };

    loadToken();

    // Check and request location permissions
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          return;
        }

        const isEnabled = await Location.hasServicesEnabledAsync();
        if (!isEnabled) {
          Alert.alert("Location services are not enabled. Please enable them.");
          return;
        }

        // Add a timeout to `getCurrentPositionAsync` to handle cases where location is not available
        const userLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
          timeout: 10000,
        });

        const { latitude, longitude } = userLocation.coords;
        setLocation({ latitude, longitude });
        setMarkerLocation({ latitude, longitude });
      } catch (error) {
        // Log and alert specific errors
        console.error("Location error:", error);
        if (error.code === "E_LOCATION_SERVICES_DISABLED") {
          Alert.alert(
            "Error",
            "Location services are disabled. Please enable them."
          );
        } else {
          Alert.alert(
            "Error",
            "Current location is unavailable. Please try again."
          );
        }
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
        await axios.post(
          "/parking/parkhere",
          {
            latitude: markerLocation.latitude,
            longitude: markerLocation.longitude,
          },
          {
            headers: { Authorization: `Bearer ${token}` }, // Attach JWT token in request header
          }
        );
        Alert.alert(
          "Parking Confirmed",
          `Vehicle parked at: Lat: ${markerLocation.latitude}, Lon: ${markerLocation.longitude}`
        );

        setIsLocationSaved(true);
      } catch (error) {
        Alert.alert("Error", "Failed to save parking location.");
        console.log(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
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
          <Button
            title={isLocationSaved ? "Location Saved" : "Park Here"}
            onPress={handleConfirmParking}
            disabled={isLocationSaved}
          />
        </>
      ) : (
        <Text>Loading your location...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "90%" },
});

export default ParkingLocationScreen;
