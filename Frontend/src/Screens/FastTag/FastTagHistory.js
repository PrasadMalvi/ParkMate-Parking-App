// screens/FastTagHistoryScreen.js
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

const FastTagHistoryScreen = () => {
  const [fastTagHistory, setFastTagHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useContext(AuthContext); // Get user ID from context

  useEffect(() => {
    const fetchFastTagHistory = async () => {
      try {
        const response = await axios.get(`/fasttag/history/${userId}`);
        setFastTagHistory(response.data); // Assuming data is an array of FastTag records
      } catch (error) {
        Alert.alert("Error fetching FastTag history", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFastTagHistory();
  }, [userId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size={80} color="#096c90" />
      ) : (
        <ScrollView>
          {fastTagHistory.length === 0 ? (
            <Text style={styles.noResults}>No FastTag history found</Text>
          ) : (
            fastTagHistory.map((record) => (
              <View key={record._id} style={styles.historyCard}>
                <Text style={styles.historyText}>
                  FastTag: {record.fastTagName}
                </Text>
                <Text style={styles.historyText}>Date: {record.date}</Text>
                <Text style={styles.historyText}>
                  Transaction Amount: ${record.amount}
                </Text>
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

export default FastTagHistoryScreen;
