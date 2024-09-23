import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import MaterialCommunityIcons for map icon

const ParkingHistoryScreen = () => {
  const [parkingHistory, setParkingHistory] = useState([]);
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
      }
    };

    fetchParkingHistory();
  }, []);

  const handleNavigateToMap = (parkingLocation) => {
    navigation.navigate("ParkedLocation", { parkingLocation }); // Navigate to ParkedLocation screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parking History</Text>
      <FlatList
        data={parkingHistory}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.dateText}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
            <View style={styles.mapIconContainer}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={24}
                color="#007bff"
                onPress={() => handleNavigateToMap(item)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#021218" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#096c90",
  },
  historyItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row", // Arrange contents horizontally
    justifyContent: "space-between", // Align items horizontally
    alignItems: "center", // Align items vertically
  },
  dateText: { fontSize: 16, color: "#096c90" },
  mapIconContainer: { flexDirection: "row", alignItems: "center" },
  viewOnMap: {
    color: "#096c90",
    textDecorationLine: "underline",
    marginLeft: 10,
  },
});

export default ParkingHistoryScreen;
