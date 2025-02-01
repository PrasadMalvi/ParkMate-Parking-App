import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";

const ParkingHistory = () => {
  const [history, setHistory] = useState([]);

  const fetchMallHistory = async (mallId) => {
    try {
      const response = await axios.get(`/admin/mallparking/history/${mallId}`);
      setHistory(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch history");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Parking History</Text>
      <Button
        title="Fetch History"
        onPress={() => fetchMallHistory("mallId")}
      />
      <FlatList
        data={history}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text>{`Session: ${item.startTime} - ${item.endTime}`}</Text>
            <Text>{`Price: $${item.price}`}</Text>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default ParkingHistory;
