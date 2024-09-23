import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { Linking } from "react-native"; // Import Linking for navigation
import MapView, { Marker } from "react-native-maps"; // Import MapView and Marker

const { width, height } = Dimensions.get("window");

const ParkedLocation = ({ route }) => {
  const { parkingLocation } = route.params; // Access parkingLocation from navigation prop

  const initialRegion = {
    latitude: parkingLocation.latitude,
    longitude: parkingLocation.longitude,
    latitudeDelta: 0.01, // Adjust delta for desired zoom level
    longitudeDelta: 0.01, // Adjust delta for desired zoom level
  };

  const handleGetDirections = () => {
    const url = `google.navigation:q=${parkingLocation.latitude},${parkingLocation.longitude}`; // Google Maps navigation URL
    Linking.openURL(url); // Open Google Maps app
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parked Location</Text>
      <MapView style={styles.map} initialRegion={initialRegion}>
        <Marker
          coordinate={{
            latitude: parkingLocation.latitude,
            longitude: parkingLocation.longitude,
          }}
          title="Parked Vehicle"
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <Text style={styles.getDirectionsButton} onPress={handleGetDirections}>
          Get Directions
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, padding: 20 },
  map: { width, height },
  buttonContainer: {
    position: "absolute", // Place button on top of the map
    bottom: 20, // Adjust button position as needed
    left: 20, // Adjust button position as needed
  },
  getDirectionsButton: {
    backgroundColor: "#096c90",
    color: "white",
    padding: 15,
    fontSize: 15,
    borderRadius: 5,
    width: 200,
    textAlign: "center",
  },
});

export default ParkedLocation;
