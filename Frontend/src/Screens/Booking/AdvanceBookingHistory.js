import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import FooterMenu from "../../Components/Menus/FooterMenu";

const AdvanceBookingHistory = ({ navigation }) => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [state] = useContext(AuthContext); // Get auth state to access the token

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const { token } = state;
        const { data } = await axios.get("/parkingspot/advancebookhistory", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          const sortedData = data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setBookingHistory(sortedData);
        } else {
          Alert.alert("Error", data.message || "No booking history found.");
        }
      } catch (error) {
        console.log("Error fetching booking history:", error);
        /* Alert.alert("Error", "Failed to load booking history."); */
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingHistory();
  }, [state.token]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#096c90" />
      </View>
    );
  }

  if (!bookingHistory.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No booking history available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookingHistory}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.bookingItem}>
            <Text style={styles.spotName}>
              {item.spot?.locationName || "Unknown Spot"}
            </Text>
            <Text style={styles.bookingDate}>
              Date: {new Date(item.bookingDate).toLocaleDateString()}
            </Text>
            <Text style={styles.bookingTime}>
              Time: {item.bookingTime || "N/A"}
            </Text>
            <Text style={styles.status}>Status: {item.status}</Text>
            {/* Button to navigate to the Map View */}
            <TouchableOpacity
              style={styles.viewOnMapButton}
              onPress={() =>
                navigation.navigate("SpotLocation", {
                  parkingLocation: {
                    latitude: item.spot.latitude,
                    longitude: item.spot.longitude,
                  },
                })
              }
            >
              <Text style={styles.viewOnMapText}>View on Map</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <FooterMenu style={styles.ABHFooter} />
    </View>
  );
};

export default AdvanceBookingHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#021218",
    paddingBottom: -10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#ffffff",
  },
  bookingItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#0a1f29",
    borderRadius: 5,
    borderColor: "#096c90",
    borderWidth: 1,
  },
  spotName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#096c90",
  },
  bookingDate: {
    fontSize: 14,
    color: "#096c90",
  },
  bookingTime: {
    fontSize: 14,
    color: "#096c90",
  },
  status: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#096c90",
  },
  viewOnMapButton: {
    marginTop: 10,
    backgroundColor: "#096c90",
    padding: 10,
    borderRadius: 5,
  },
  viewOnMapText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  ABHFooter: {
    paddingTop: 20,
  },
});
