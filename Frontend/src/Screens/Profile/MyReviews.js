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
import { AuthContext } from "../../Context/AuthContext";

const MyFeedBack = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [state] = useContext(AuthContext);
  const { token } = state;
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("/parking/feedback/fetch", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data);
        setFeedbacks(response.data.data); // Assuming response structure is correct
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        Alert.alert(
          "Error",
          error.response?.data?.message || "Failed to fetch feedbacks."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#096c90" />
      </View>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No feedback available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={feedbacks}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.feedbackItem}>
          <Text style={styles.feedbackText}>
            Date: {new Date(item.date).toLocaleString()}
          </Text>
          <Text style={styles.feedbackText}>
            Location: ({item.latitude}, {item.longitude})
          </Text>
          <Text style={styles.feedbackText}>
            Safety Option: {item.feedback?.safetyOption || "N/A"}
          </Text>
          <Text style={styles.feedbackText}>
            Additional Feedback: {item.feedback?.additionalFeedback || "N/A"}
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackItem: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MyFeedBack;
