// screens/MallParkingHistoryScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

const MallParkingHistoryScreen = () => {
  const [parkingHistory, setParkingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useContext(AuthContext); // Get user ID from context

  useEffect(() => {
    const fetchParkingHistory = async () => {
      try {
        const response = await axios.get(`/mallparking/history/${userId}`);
        setParkingHistory(response.data); // Assuming data is an array of parking records
      } catch (error) {
        Alert.alert("Error fetching parking history", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParkingHistory();
  }, [userId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size={80} color="#096c90" />
      ) : (
        <ScrollView>
          {parkingHistory.length === 0 ? (
            <Text style={styles.noResults}>No parking history found</Text>
          ) : (
            parkingHistory.map((record) => (
              <View key={record._id} style={styles.historyCard}>
                <Text style={styles.historyText}>Mall: {record.mallName}</Text>
                <Text style={styles.historyText}>Date: {record.date}</Text>
                <Text style={styles.historyText}>
                  Duration: {record.duration} hours
                </Text>
                <Text style={styles.historyText}>Price: ${record.price}</Text>
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
    backgroundColor: "#021218",
  },
  historyCard: {
    backgroundColor: "#0a1f29",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  historyText: {
    color: "#4A90E2",
  },
  noResults: {
    textAlign: "center",
    color: "#777",
    fontSize: 18,
    marginTop: 20,
  },
});

export default MallParkingHistoryScreen;
