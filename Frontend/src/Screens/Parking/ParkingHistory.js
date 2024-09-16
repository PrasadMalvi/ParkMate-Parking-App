import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ParkingHistoryScreen = () => {
  const [parkingHistory, setParkingHistory] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchParkingHistory = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("jwt_token");
        setToken(storedToken);

        const response = await axios.get(`/parking/Parkinghistory`, {
          headers: { Authorization: `Bearer ${storedToken}` }, // Use token from storage
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parking History</Text>
      <FlatList
        data={parkingHistory}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text>{`Lat: ${item.latitude}, Lon: ${item.longitude}`}</Text>
            <Text>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  historyItem: { padding: 10, borderBottomWidth: 1, borderColor: "#ccc" },
});

export default ParkingHistoryScreen;
