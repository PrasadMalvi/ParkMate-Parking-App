import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { Linking } from "react-native"; // Import Linking for navigation
import MapView, { Marker } from "react-native-maps"; // Import MapView and Marker

const { width, height } = Dimensions.get("window");

const MallLocation = ({ route }) => {
  const { mallDetails } = route.params; // Access mallDetails from navigation prop

  const initialRegion = {
    latitude: mallDetails.location.latitude,
    longitude: mallDetails.location.longitude,
    latitudeDelta: 0.01, // Adjust delta for desired zoom level
    longitudeDelta: 0.01, // Adjust delta for desired zoom level
  };

  const handleGetDirections = () => {
    const url = `google.navigation:q=${mallDetails.location.latitude},${mallDetails.location.longitude}`; // Google Maps navigation URL
    Linking.openURL(url); // Open Google Maps app
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        <Marker
          coordinate={{
            latitude: mallDetails.location.latitude,
            longitude: mallDetails.location.longitude,
          }}
          title={mallDetails.name} // Set marker title to mall name
          description={mallDetails.address} // Set marker description to mall address
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
  container: {
    flex: 1,
    backgroundColor: "#021218",
    marginTop: 30,
  },
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

export default MallLocation;
