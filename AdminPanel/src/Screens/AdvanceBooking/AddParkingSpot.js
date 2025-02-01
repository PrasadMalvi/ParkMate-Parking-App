import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../../Context/AuthContext";

const AddParkingSpot = () => {
  const state = useContext(AuthContext);
  const [locationName, setLocationName] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [vehicleType, setVehicleType] = useState("two-wheeler");
  const { logout } = useContext(AuthContext); // Access the logout function from AuthContext

  const [maxSlots, setMaxSlots] = useState({
    "two-wheeler": 0,
    "four-wheeler": 0,
    other: 0,
  });
  const [timeSlots, setTimeSlots] = useState({
    "two-wheeler": [],
    "four-wheeler": [],
    other: [],
  });
  const [newTimeSlot, setNewTimeSlot] = useState({
    startTime: "08:00",
    endTime: "09:00",
  });
  const { token } = state;

  const handleAddTimeSlot = (type) => {
    const updatedTimeSlots = [
      ...timeSlots[type],
      { ...newTimeSlot, maxSlots: maxSlots[type] || 0 },
    ];

    setTimeSlots((prev) => ({
      ...prev,
      [type]: updatedTimeSlots,
    }));

    // Reset new time slot inputs after adding
    setNewTimeSlot({ startTime: "08:00", endTime: "09:00" });
  };

  const handleMaxSlotsChange = (value) => {
    setMaxSlots((prev) => ({
      ...prev,
      [vehicleType]: Number(value) || 0,
    }));
  };
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await logout(); // Call the logout function
            navigation.navigate("AdminLogin"); // Navigate back to login
          },
        },
      ],
      { cancelable: false }
    );
  };
  const handleSubmit = async () => {
    const { token } = state; // Retrieve token from context
    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }

    const data = {
      locationName,
      fullAddress,
      latitude,
      longitude,
      vehicleTypes: [
        { type: "two-wheeler", timeSlots: timeSlots["two-wheeler"] },
        { type: "four-wheeler", timeSlots: timeSlots["four-wheeler"] },
        { type: "other", timeSlots: timeSlots.other },
      ],
    };

    try {
      const response = await axios.post(
        "http://192.168.0.101:5050/admin/parkingspot/create",
        data,
        {
          headers: { Authorization: `Bearer ${token}` }, // Add token to headers
        }
      );

      console.log(response.data); // Success response
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Status code:", error.response.status);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.cardContainer}>
        <Text style={styles.title}>Add Parking Spot</Text>
        <Text>Location Full Name:</Text>
        <TextInput
          value={locationName}
          onChangeText={setLocationName}
          style={styles.input}
        />
        <Text>Full Address:</Text>
        <TextInput
          value={fullAddress}
          onChangeText={setFullAddress}
          style={styles.input}
        />
        <Text>Select Location on Map:</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 12.981199, // Default value
            longitude: 77.596905, // Default value
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setLatitude(latitude);
            setLongitude(longitude);
          }}
        >
          {latitude && longitude && (
            <Marker coordinate={{ latitude, longitude }} draggable />
          )}
        </MapView>

        <Text>Select Vehicle Type:</Text>
        <Picker
          selectedValue={vehicleType}
          style={styles.picker}
          onValueChange={(itemValue) => setVehicleType(itemValue)}
        >
          <Picker.Item label="Two-Wheeler" value="two-wheeler" />
          <Picker.Item label="Four-Wheeler" value="four-wheeler" />
          <Picker.Item label="Other" value="other" />
        </Picker>

        {vehicleType === "two-wheeler" && (
          <View>
            <Text>Max Two-Wheeler Slots:</Text>
            <TextInput
              keyboardType="numeric"
              value={String(maxSlots["two-wheeler"])}
              onChangeText={handleMaxSlotsChange}
              style={styles.input}
            />
            <Text>Start Time:</Text>
            <TextInput
              value={newTimeSlot.startTime}
              onChangeText={(value) =>
                setNewTimeSlot((prev) => ({ ...prev, startTime: value }))
              }
              style={styles.input}
            />
            <Text>End Time:</Text>
            <TextInput
              value={newTimeSlot.endTime}
              onChangeText={(value) =>
                setNewTimeSlot((prev) => ({ ...prev, endTime: value }))
              }
              style={styles.input}
            />
            <Button
              title="Add Time Slot"
              onPress={() => handleAddTimeSlot("two-wheeler")}
            />
            {/* Display added time slots */}
            {timeSlots["two-wheeler"].map((slot, index) => (
              <Text key={index}>
                Time Slot {index + 1}: {slot.startTime} - {slot.endTime} (Max:{" "}
                {slot.maxSlots})
              </Text>
            ))}
          </View>
        )}

        {vehicleType === "four-wheeler" && (
          <View>
            <Text>Max Four-Wheeler Slots:</Text>
            <TextInput
              keyboardType="numeric"
              value={String(maxSlots["four-wheeler"])}
              onChangeText={handleMaxSlotsChange}
              style={styles.input}
            />
            <Text>Start Time:</Text>
            <TextInput
              value={newTimeSlot.startTime}
              onChangeText={(value) =>
                setNewTimeSlot((prev) => ({ ...prev, startTime: value }))
              }
              style={styles.input}
            />
            <Text>End Time:</Text>
            <TextInput
              value={newTimeSlot.endTime}
              onChangeText={(value) =>
                setNewTimeSlot((prev) => ({ ...prev, endTime: value }))
              }
              style={styles.input}
            />
            <Button
              title="Add Time Slot"
              onPress={() => handleAddTimeSlot("four-wheeler")}
            />
            {/* Display added time slots */}
            {timeSlots["four-wheeler"].map((slot, index) => (
              <Text key={index}>
                Time Slot {index + 1}: {slot.startTime} - {slot.endTime} (Max:{" "}
                {slot.maxSlots})
              </Text>
            ))}
          </View>
        )}

        {vehicleType === "other" && (
          <View>
            <Text>Max Other Vehicle Slots:</Text>
            <TextInput
              keyboardType="numeric"
              value={String(maxSlots.other)}
              onChangeText={(value) =>
                setMaxSlots((prev) => ({ ...prev, other: Number(value) }))
              }
              style={styles.input}
            />
            <Text>Start Time:</Text>
            <TextInput
              value={newTimeSlot.startTime}
              onChangeText={(value) =>
                setNewTimeSlot((prev) => ({ ...prev, startTime: value }))
              }
              style={styles.input}
            />
            <Text>End Time:</Text>
            <TextInput
              value={newTimeSlot.endTime}
              onChangeText={(value) =>
                setNewTimeSlot((prev) => ({ ...prev, endTime: value }))
              }
              style={styles.input}
            />
            <Button
              title="Add Time Slot"
              onPress={() => handleAddTimeSlot("other")}
            />
            {/* Display added time slots */}
            {timeSlots.other.map((slot, index) => (
              <Text key={index}>
                Time Slot {index + 1}: {slot.startTime} - {slot.endTime} (Max:{" "}
                {slot.maxSlots})
              </Text>
            ))}
          </View>
        )}
        <Button
          title="Logout" // Add a button for logging out
          onPress={handleLogout} // Call the handleLogout function
          color="#ff0000" // Optional: Change the button color to indicate logout
        />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  map: {
    width: "100%",
    height: 300,
    marginBottom: 10,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
});

export default AddParkingSpot;
