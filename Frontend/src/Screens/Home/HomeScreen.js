import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import HeaderMenu from "../../Components/Menus/HeaderMenu";
import FooterMenu from "../../Components/Menus/FooterMenu";
import ParkingLocationScreen from "../Parking/ParkingLocationScreen"; // Reusing the screen
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"; // Correct import
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import MaterialCommunityIcons for map icon
import HomeSkeleton from "../../Components/Skeletons/HomeSkeleton";

const HomeScreen = () => {
  const [parkingHistory, setParkingHistory] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [state] = useContext(AuthContext);
  const navigation = useNavigation();

  // Fetching recent parking history (top 3)
  useEffect(() => {
    const fetchParkingHistory = async () => {
      try {
        const { token } = state;
        const response = await axios.get(`/parking/parkinghistory`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          // Only take the first 3 entries for the recent history
          setParkingHistory(response.data.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching parking history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParkingHistory();
  }, [state]);

  const handleViewMoreParking = () => {
    navigation.navigate("ParkingHistory");
  };

  const handleSearchPress = () => {
    navigation.navigate("BookingScreen");
  };

  if (loading) {
    return <HomeSkeleton />; // Render skeleton during loading
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <HeaderMenu style={styles.headerStyle} />

      {/* Half-screen Parking Location */}
      <View style={styles.parkingLocationContainer}>
        <ParkingLocationScreen />
      </View>

      {/* Another half screen: Recent Parking History */}
      <View style={styles.historySection}>
        {/* Search Bar inside History Section */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            onPress={handleSearchPress}
            style={styles.searchBar}
          >
            <TextInput
              style={styles.searchInput}
              placeholder="Search for Advance Book"
              placeholderTextColor={"#096c90"}
              editable={false} // To disable typing, as the user will navigate to BookingScreen
            />
          </TouchableOpacity>
        </View>
        {/* Bottom Footer */}
        <Text style={styles.historyTitle1}>Explore More</Text>

        <FooterMenu />
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Recents</Text>
          <TouchableOpacity onPress={handleViewMoreParking}>
            <Text style={styles.viewMoreText}>View More</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#096c90" />
        ) : parkingHistory.length === 0 ? (
          <Text style={styles.noHistoryText}>No parking history available</Text>
        ) : (
          <FlatList
            style={styles.historybox}
            data={parkingHistory}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <Text style={styles.location}>
                  {new Date(item.date).toLocaleDateString()} {" \n"}
                  {new Date(item.date).toLocaleTimeString()}
                </Text>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={24}
                  color="#096c90"
                  marginLeft={150}
                  marginTop={-30}
                />
                <Text
                  style={styles.viewOnMap}
                  onPress={() =>
                    navigation.navigate("ParkedLocation", {
                      parkingLocation: item,
                    })
                  }
                >
                  View on Map
                </Text>
                {/* Horizontal line separator */}
                <View style={styles.separator} />
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 20,
    paddingBottom: -50,
  },
  headerStyle: {
    // Add custom styles for header if needed
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10, // Space between search bar and parking history items
    marginTop: 10,
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#0a1f29",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    shadowColor: "#000", // Shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    height: 40,
  },
  searchInput: {
    color: "#ffffff", // Text color
    fontSize: 15,
  },
  profileIcon: {
    // Adjust icon positioning if needed
    fontSize: 35,
    marginBottom: 2,
  },
  parkingLocationContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    width: 400,
    marginLeft: -20,
    marginTop: -25,
  },
  historySection: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#1b262f",
    marginTop: -100,
    width: 360,
    marginLeft: -20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#096c90",
    marginTop: 5,
  },
  historyTitle1: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#096c90",
    marginTop: 5,
    paddingLeft: 10,
    marginBottom: -3,
  },
  viewMoreText: {
    color: "#096c90",
  },
  historyItem: {
    padding: 15,
    borderRadius: 15,
    height: 70,
    paddingTop: 25,
  },
  historybox: {
    borderRadius: 15,
    backgroundColor: "#0a1f29",
    marginBottom: -2,
  },
  location: {
    color: "#096c90",
    fontWeight: "bold",
    paddingLeft: 20,
    marginTop: -5,
  },
  viewOnMap: {
    color: "#096c90",
    marginTop: -23,
    marginLeft: 180,
  },
  noHistoryText: {
    color: "#ffffff",
    textAlign: "center",
  },
  separator: {
    width: "80%",
    marginLeft: 20,
    marginTop: 30,
    height: 1,
    backgroundColor: "#096c90", // Color of the separator line
    marginVertical: 5, // Space between items
  },
});

export default HomeScreen;
