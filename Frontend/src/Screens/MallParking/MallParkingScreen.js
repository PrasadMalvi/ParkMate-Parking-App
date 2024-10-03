// screens/MallDetailsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const MallDetailsScreen = () => {
  const [malls, setMalls] = useState([]); // State to hold mall details
  const [loading, setLoading] = useState(true); // State to track loading
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMallDetails = async () => {
      try {
        const response = await axios.get(`/mallparking/malldetails`); // Fetch all malls
        setMalls(response.data.malls); // Update state with mall data
      } catch (error) {
        Alert.alert("Failed to load mall details");
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchMallDetails();
  }, []);

  const handleViewQRCode = (mall) => {
    // Navigate to view QR code screen with mall details
    navigation.navigate("ViewQRCode", {
      mallName: mall.name,
      mallAddress: mall.address,
      mallPricing: mall.pricing,
      mallId: mall._id,
      mallLocation: mall.location, // Include location details
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        // Show loading indicator while data is being fetched
        <ActivityIndicator size={80} color="#096c90" style={styles.loader} />
      ) : (
        <ScrollView>
          {malls.map((mall) => (
            <View key={mall._id} style={styles.mallCard}>
              <Text style={styles.mallName}>{mall.name}</Text>
              <Text style={styles.mallAddress}>{mall.address}</Text>
              <Button
                title="View More Details"
                onPress={() => handleViewQRCode(mall)} // Navigate to view QR code with mall data
                color="#096c90" // Button color
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#021218", // Background color
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mallCard: {
    backgroundColor: "#0a1f29", // Card background color
    borderRadius: 8,
    borderColor: "#096c90",
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000", // Shadow for depth
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2, // Elevation for Android
  },
  mallName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A90E2", // Color for mall name
  },
  mallAddress: {
    fontSize: 16,
    color: "#777", // Softer color for address
    marginVertical: 5,
  },
});

export default MallDetailsScreen;
