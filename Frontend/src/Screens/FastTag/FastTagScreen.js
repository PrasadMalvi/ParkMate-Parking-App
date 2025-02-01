import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../../Context/AuthContext";
import FooterMenu from "../../Components/Menus/FooterMenu";

const FastTagSreen = () => {
  const [fastTags, setFastTags] = useState([]); // State to hold FastTag details
  const [loading, setLoading] = useState(true); // State to track loading
  const [search, setSearch] = useState(""); // State for search input
  const navigation = useNavigation();
  const [state] = useContext(AuthContext);

  useEffect(() => {
    const fetchFastTags = async () => {
      setLoading(true); // Start loading before the fetch
      try {
        const { token } = state;
        const { data } = await axios.get("/fasttag/allfasttag", {
          params: { name: search }, // Adjust based on your API
          headers: { Authorization: `Bearer ${token}` },
        });
        setFastTags(data); // Update state with FastTag data
      } catch (error) {
        Alert.alert("Error fetching FastTags", error.message); // Show alert on error
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchFastTags();
  }, [search, state]); // Add search and state as dependencies

  const handleViewMore = (fastTag) => {
    // Navigate to FastTag detail page with FastTag data
    navigation.navigate("ViewFastTagQRCode", {
      fastTagId: fastTag._id,
      fastTagName: fastTag.name,
      fastTagLocation: fastTag.location,
      fastAddress: fastTag.address,
      fastTagRegistrationNumber: fastTag.registrationNumber,
      fastTagPrice: fastTag.price,
      fastTagBalance: fastTag.balance,
    });
  };
  const handleViewMoreParking = () => {
    navigation.navigate("FastTagHistory");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search FastTag by name"
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
          {fastTags.length === 0 ? ( // Show message if no FastTags found
            <Text style={styles.noResults}>No FastTags found</Text>
          ) : (
            fastTags.map((tag) => (
              <View key={tag._id} style={styles.fastTagCard}>
                <Text style={styles.fastTagName}>{tag.name}</Text>
                <Text style={styles.fastTagLocation}>{tag.address}</Text>
                <Button
                  title="View More"
                  onPress={() => handleViewMore(tag)} // Navigate to FastTag details
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
    backgroundColor: "#021218", // Background color
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  fastTagCard: {
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
  fastTagName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A90E2", // Color for FastTag name
  },
  fastTagLocation: {
    fontSize: 16,
    color: "#777", // Softer color for location
    marginVertical: 5,
  },
  searchInput: {
    height: 40,
    borderColor: "#096c90",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  noResults: {
    textAlign: "center",
    color: "#777",
    fontSize: 18,
    marginTop: 20,
  },
});

export default FastTagSreen;
