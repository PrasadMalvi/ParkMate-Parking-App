import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import FooterMenu from "../../Components/Menus/FooterMenu";

const ConfirmBookingScreen = ({ route, navigation }) => {
  const { spotId } = route.params;
  const [parkingSpot, setParkingSpot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [vehicleType, setVehicleType] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [state] = useContext(AuthContext);

  useEffect(() => {
    const fetchParkingSpotDetails = async () => {
      try {
        const { token } = state;
        const { data } = await axios.get(`/parkingspot/${spotId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setParkingSpot(data.data);
        console.log("Fetched Parking Spot:", data.data); // Debugging line
      } catch (error) {
        console.log("Error fetching parking spot details:", error);
        Alert.alert("Error", "Failed to load parking spot details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchParkingSpotDetails();
  }, [spotId, state.token]);

  const handleConfirmBooking = async () => {
    if (!vehicleType || !selectedTimeSlot) {
      Alert.alert("Error", "Please select both vehicle type and time slot.");
      return;
    }
    try {
      setIsBooking(true);
      const { token } = state;
      const [startTime, endTime] = selectedTimeSlot.split(" - ");
      const bookingData = {
        spotId,
        vehicleType,
        timeSlot: { startTime, endTime },
      };

      await axios.post(`/parkingspot/advancebook`, bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local state to reflect booking
      setParkingSpot((prevSpot) => {
        const updatedTimeSlots = prevSpot.timeSlots.map((slot) => {
          if (slot.startTime === startTime && slot.endTime === endTime) {
            return {
              ...slot,
              isBooked: true,
              maxSlots: {
                ...slot.maxSlots,
                [vehicleType]: slot.maxSlots[vehicleType] - 1,
              },
            };
          }
          return slot;
        });
        return { ...prevSpot, timeSlots: updatedTimeSlots };
      });

      Alert.alert("Success", "Parking spot booked successfully!");
      navigation.navigate("AdvanceBookingHistory");
    } catch (error) {
      console.log("Error booking parking spot:", error);
      Alert.alert("Error", "Failed to book parking spot.");
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={80} color="#096c90" />
      </View>
    );
  }

  if (!parkingSpot) {
    return (
      <View style={styles.container}>
        <Text style={styles.fullText}>Parking spot details unavailable</Text>
      </View>
    );
  }

  // Add debug logs to inspect `maxSlots` for each time slot
  console.log("Vehicle Type selected:", vehicleType);

  // Filter available time slots based on the selected vehicle type
  const filteredTimeSlots = parkingSpot.timeSlots.filter((slot) => {
    // Log maxSlots for debugging
    console.log("Slot startTime:", slot.startTime, "maxSlots:", slot.maxSlots);
    const maxSlotsForVehicle = slot.maxSlots[vehicleType];
    console.log(`maxSlots for ${vehicleType}:`, maxSlotsForVehicle);
    return maxSlotsForVehicle > 0 && !slot.isBooked;
  });

  const timeSlotLabels = filteredTimeSlots.map((slot) => ({
    label: `${slot.startTime} - ${slot.endTime} (Available: ${slot.maxSlots[vehicleType]})`,
    value: `${slot.startTime} - ${slot.endTime}`,
  }));

  return (
    <View style={styles.container}>
      {/* Parking Spot Details */}
      <View style={styles.spotDetails}>
        <Text style={styles.location}>
          {parkingSpot.locationName || "No Name Available"}
        </Text>
        <Text style={styles.address}>
          {parkingSpot.fullAddress || "No Address Available"}
        </Text>
      </View>

      {/* Vehicle Type Selection */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Select Vehicle Type:</Text>
        <Picker
          selectedValue={vehicleType}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setVehicleType(itemValue);
            setSelectedTimeSlot(""); // Reset time slot when vehicle type changes
          }}
        >
          <Picker.Item label="Select vehicle type" value="" />
          {parkingSpot.vehicleTypes.map((type, index) => (
            <Picker.Item key={index} label={type.type} value={type.type} />
          ))}
        </Picker>
      </View>

      {/* Time Slot Selection */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Select Time Slot:</Text>
        <Picker
          selectedValue={selectedTimeSlot}
          style={styles.picker}
          enabled={vehicleType !== ""}
          onValueChange={(itemValue) => setSelectedTimeSlot(itemValue)}
        >
          <Picker.Item label="Select time slots" value="" />
          {timeSlotLabels.length === 0 ? (
            <Picker.Item label="No slots available" value="" />
          ) : (
            timeSlotLabels.map((slot, index) => (
              <Picker.Item key={index} label={slot.label} value={slot.value} />
            ))
          )}
        </Picker>
      </View>

      {/* Confirm Booking Button */}
      <Button
        title={isBooking ? "Booking..." : "Confirm Booking"}
        onPress={handleConfirmBooking}
        color="#096c90"
        disabled={!vehicleType || !selectedTimeSlot || isBooking}
      />

      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#021218",
    justifyContent: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#021218",
  },
  fullText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  spotDetails: {
    marginBottom: 30,
    padding: 15,
    borderColor: "#096c90",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#0a1f29",
  },
  location: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: "white",
  },
  address: {
    fontSize: 14,
    marginBottom: 10,
    color: "white",
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  picker: {
    height: 50,
    color: "white",
    backgroundColor: "#0a1f29",
    borderColor: "#096c90",
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default ConfirmBookingScreen;
