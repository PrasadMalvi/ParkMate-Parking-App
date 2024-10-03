import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import MaterialCommunityIcons for map icon
import FooterMenu from "../../Components/Menus/FooterMenu";

const ParkingHistoryScreen = () => {
  const [parkingHistory, setParkingHistory] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [state, setState] = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchParkingHistory = async () => {
      try {
        const { token } = state;
        const response = await axios.get(`/parking/parkinghistory`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setParkingHistory(response.data.data);
        } else {
          Alert.alert("Error", "Failed to fetch parking history");
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "An error occurred while fetching parking history."
        );
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchParkingHistory();
  }, []);

  const handleNavigateToMap = (parkingLocation) => {
    navigation.navigate("ParkedLocation", { parkingLocation }); // Navigate to ParkedLocation screen
  };

  return (
    <View style={styles.container}>
      {/* Show activity indicator while loading */}
      {loading ? (
        <ActivityIndicator
          size={80}
          color="#007bff"
          style={styles.loadingIndicator}
        />
      ) : parkingHistory.length === 0 ? (
        <Text style={styles.fullText}>No parking history</Text>
      ) : (
        <FlatList
          data={parkingHistory}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.location}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
              <Text style={styles.address}>
                {new Date(item.date).toLocaleTimeString()}
              </Text>
              <View style={styles.mapIconContainer}>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={24}
                  color="#007bff"
                  onPress={() => handleNavigateToMap(item)}
                  marginLeft={150}
                  marginTop={-70}
                />
                <Text
                  style={styles.viewOnMap}
                  onPress={() => handleNavigateToMap(item)}
                >
                  View on Map
                </Text>
              </View>
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
  fullText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  historyItem: {
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
  mapIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewOnMap: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#096c90",
    padding: 10,
    borderRadius: 5,
    marginTop: -70,
    marginLeft: 10,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
  },
});

export default ParkingHistoryScreen;
