import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert } from "react-native";
import FooterMenu from "../../Components/Menus/FooterMenu";

const BookingScreen = () => {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    // Fetch available parking spots from backend API
    fetch("https://your-api-url/available-parking-spots")
      .then((response) => response.json())
      .then((data) => {
        setParkingSpots(data.spots);
        setIsFull(data.spots.length === 0);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleBooking = (spotId) => {
    // Implement booking logic here
    Alert.alert("Booking Confirmed", `Spot ID: ${spotId}`);
  };

  return (
    <View style={styles.container}>
      {isFull ? (
        <Text style={styles.fullText}>Parking is Full</Text>
      ) : (
        <FlatList
          data={parkingSpots}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.spotItem}>
              <Text style={styles.location}>{item.location}</Text>
              <Button title="Book Now" onPress={() => handleBooking(item.id)} />
            </View>
          )}
        />
      )}
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  fullText: { fontSize: 18, color: "red", textAlign: "center" },
  spotItem: {
    marginVertical: 10,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  location: { fontSize: 16, marginBottom: 10 },
});

export default BookingScreen;
