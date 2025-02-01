import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import FooterMenu from "../../Components/Menus/FooterMenu";
import AdvanceBookSkeleton from "../../Components/Skeletons/AdvanceBookSkeleton";

const MallDetailsScreen = () => {
  const [malls, setMalls] = useState([]); // State to hold mall details
  const [loading, setLoading] = useState(true); // State to track loading
  const [search, setSearch] = useState(""); // State for search input

  const navigation = useNavigation();

  useEffect(() => {
    const fetchMallDetails = async () => {
      setLoading(true); // Start loading before the fetch
      try {
        const response = await axios.get(`/mallparking/malldetails`, {
          params: { name: search }, // Send search query as a parameter
        }); // Fetch all malls
        setMalls(response.data.malls); // Update state with mall data
      } catch (error) {
        Alert.alert("Failed to load mall details");
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchMallDetails(); // Call fetchMallDetails every time `search` changes
  }, [search]); // Add `search` as a dependency

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
  const handleViewMoreParking = () => {
    navigation.navigate("MallParkingHistory");
  };

  if (loading) {
    return <AdvanceBookSkeleton />; // Render skeleton during loading
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search malls by name"
        value={search}
        placeholderTextColor={"#096c90"}
        color={"#096c90"}
        onChangeText={setSearch} // Update search state on input change
      />
      <View style={styles.historyHeader}>
        <TouchableOpacity onPress={handleViewMoreParking}>
          <Text style={styles.viewMoreText}>Click here for Recent History</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        // Show loading indicator while data is being fetched
        <ActivityIndicator size={80} color="#096c90" style={styles.loader} />
      ) : (
        <ScrollView>
          {malls.length === 0 ? ( // Show message if no malls found
            <Text style={styles.noResults}>No malls found</Text> // Ensure this is wrapped in <Text>
          ) : (
            malls.map((mall) => (
              <View key={mall._id} style={styles.mallCard}>
                <Text style={styles.mallName}>{mall.name}</Text>
                <Text style={styles.mallAddress}>{mall.address}</Text>
                <Button
                  title="View More Details"
                  onPress={() => handleViewQRCode(mall)} // Navigate to view QR code with mall data
                  color="#096c90" // Button color
                />
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: -50,
    backgroundColor: "#021218",
  },
  searchInput: {
    height: 40,
    borderColor: "#096c90",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  historyHeader: {
    width: 200,
    borderRadius: 25,
    marginLeft: 120,
    marginBottom: 5,
  },
  viewMoreText: {
    color: "#096c90",
    textAlign: "center",
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
  noResults: {
    textAlign: "center",
    color: "#777",
    fontSize: 18,
    marginTop: 20,
  },
});

export default MallDetailsScreen;
