import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import FooterMenu from "../../Components/Menus/FooterMenu";

const BookingScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [parkingSpots, setParkingSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [isFull, setIsFull] = useState(false);
  const [state] = useContext(AuthContext);

  // Fetch parking spots when component mounts or when searchQuery changes
  useEffect(() => {
    const fetchParkingSpots = async () => {
      try {
        const { token } = state;
        const { data } = await axios.get("/parkingspot/search", {
          params: { name: searchQuery }, // Adjust based on your API
          headers: { Authorization: `Bearer ${token}` },
        });
        setParkingSpots(data.data); // Assuming the response has `data.data`
        setFilteredSpots(data.data);
        setIsFull(data.data.length === 0);
      } catch (error) {
        console.log("Error fetching parking spots:", error);
        Alert.alert("Error", "Failed to fetch parking spots.");
      }
    };

    fetchParkingSpots();
  }, [searchQuery, state.token]);

  // Filter parking spots based on search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = parkingSpots.filter((spot) =>
      spot.locationName?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSpots(filtered);
    setIsFull(filtered.length === 0);
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name"
        placeholderTextColor={"#096c90"}
        value={searchQuery}
        color={"#096c90"}
        onChangeText={handleSearch}
      />

      {/* If no spots are found */}
      {isFull ? (
        <Text style={styles.fullText}>No available parking spots</Text>
      ) : (
        <FlatList
          data={filteredSpots}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.spotItem}>
              <Text style={styles.location}>
                {item.locationName || "No Name Available"}
              </Text>
              <Text style={styles.address}>
                {item.fullAddress || "No Address Available"}
              </Text>
              <Button
                title="View Details"
                color="#096c90"
                onPress={() =>
                  navigation.navigate("ConfirmBookingScreen", {
                    spotId: item._id,
                  })
                }
              />
            </View>
          )}
        />
      )}

      {/* Footer Menu */}
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#021218",
    paddingBottom: -10,
    paddingTop: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#096c90",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
    color: "#096c90", // Input text color
  },
  fullText: { fontSize: 18, color: "red", textAlign: "center" },
  spotItem: {
    marginVertical: 10,
    padding: 15,
    borderColor: "#096c90",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#0a1f29", // Background color for spot item
  },
  location: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: "white", // Text color for location
  },
  address: {
    fontSize: 14,
    marginBottom: 10,
    color: "white", // Text color for address
  },
});

export default BookingScreen;
