import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView, // Import ScrollView
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

const PricingItem = ({ item, index, onChange }) => {
  return (
    <View style={styles.pricingItem}>
      <TextInput
        style={styles.pricingInput}
        placeholder="Duration (minutes)"
        value={item.duration}
        onChangeText={(value) => onChange(index, "duration", value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.pricingInput}
        placeholder="Price ($)"
        value={item.price}
        onChangeText={(value) => onChange(index, "price", value)}
        keyboardType="numeric"
      />
    </View>
  );
};

const AddMallDetails = () => {
  const [mallName, setMallName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [pricing, setPricing] = useState([{ duration: "", price: "" }]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMall, setIsAddingMall] = useState(false);
  const [markerLocation, setMarkerLocation] = useState(null);
  const { state } = useContext(AuthContext); // Updated line
  const { token } = state;

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          setIsLoading(false);
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = userLocation.coords;
        setLatitude(latitude);
        setLongitude(longitude);
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
  };

  const handleAddPricing = () => {
    setPricing([...pricing, { duration: "", price: "" }]);
  };

  const handlePricingChange = (index, field, value) => {
    const newPricing = [...pricing];
    newPricing[index][field] = value;
    setPricing(newPricing);
  };

  const addMall = async () => {
    if (!mallName || !address || !markerLocation || pricing.length === 0) {
      Alert.alert("Error", "Please fill all fields correctly.");
      return;
    }

    const pricingData = pricing
      .map((item) => ({
        duration: parseInt(item.duration, 10),
        price: parseFloat(item.price),
      }))
      .filter((item) => item.duration > 0 && item.price > 0);

    if (pricingData.length === 0) {
      Alert.alert("Error", "Please provide valid pricing details.");
      return;
    }

    setIsAddingMall(true);
    console.log("Token:", token); // Log the token for verification
    console.log("Mall Name:", mallName);
    console.log("Address:", address);
    console.log("Marker Location:", markerLocation);
    console.log("Pricing Data:", pricingData);

    try {
      const response = await axios.post(
        "http://192.168.137.247:5050/adminmallparking/add",
        {
          name: mallName,
          location: markerLocation,
          address,
          pricing: pricingData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 20000,
        }
      );

      // Log the response to see what the server returns
      console.log("API Response:", response.data);

      Alert.alert("Success", "Mall added successfully");
      resetFields();
    } catch (error) {
      console.error("Error details:", error); // Log the full error object
      if (error.response) {
        console.error("Response data:", error.response.data);
        Alert.alert(
          "Error",
          "Failed to add mall: " + error.response.data.message
        );
      } else if (error.request) {
        console.error("Request data:", error.request);
        Alert.alert(
          "Error",
          "No response received. Check your network connection."
        );
      } else {
        console.error("Request setup error:", error.message);
        Alert.alert("Error", "Failed to add mall: " + error.message);
      }
    } finally {
      setIsAddingMall(false);
    }
  };

  const resetFields = () => {
    setMallName("");
    setAddress("");
    setLatitude(null);
    setLongitude(null);
    setPricing([{ duration: "", price: "" }]);
    setMarkerLocation(null);
  };

  const onMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerLocation({ latitude, longitude });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.Addcard}>
            <TextInput
              style={styles.input}
              placeholder="Mall Name"
              value={mallName}
              onChangeText={setMallName}
            />
            <TextInput
              style={styles.input}
              placeholder="Full Address"
              value={address}
              onChangeText={setAddress}
            />

            {/* Map View for Pinpointing Location */}
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: markerLocation?.latitude || latitude,
                  longitude: markerLocation?.longitude || longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onPress={onMapPress}
              >
                {markerLocation && (
                  <Marker
                    coordinate={markerLocation}
                    draggable
                    onDragEnd={handleMarkerDragEnd}
                    title="Mall Location"
                  />
                )}
              </MapView>
            </View>

            {/* Pricing Details Card */}
            <Text style={styles.pricingHeader}>Pricing Details</Text>

            <FlatList
              data={pricing}
              renderItem={({ item, index }) => (
                <PricingItem
                  item={item}
                  index={index}
                  onChange={handlePricingChange}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity
              style={styles.addPricingButton}
              onPress={handleAddPricing}
            >
              <Text style={styles.addPricingButtonText}>Add Pricing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addMallButton}
              onPress={addMall}
              disabled={isAddingMall}
            >
              {isAddingMall ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.buttonText}
                />
              ) : (
                <Text style={styles.buttonText}>Add Mall</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Addcard: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 20,
    marginTop: -30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    width: "90%", // Set width to avoid stretching
    marginTop: 20,
  },
  mapContainer: {
    width: "100%",
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  pricingHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 15,
    textAlign: "center",
  },
  pricingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%", // Set width to avoid stretching
  },
  pricingInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#f9f9f9",
  },
  addPricingButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  addPricingButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    width: 300,
    textAlign: "center",
  },
  addMallButton: {
    backgroundColor: "#1b262f",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    width: 300,
    textAlign: "center",
  },
});

export default AddMallDetails;
