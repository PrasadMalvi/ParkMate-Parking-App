import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../../Context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";

const MyVehicleDetails = () => {
  const [state] = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    registrationNumber: "",
    ownerName: "",
    model: "",
    registrationDate: new Date(),
    state: "",
    vehicleType: "two-wheeler",
    color: "",
    engineNumber: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { token, userId } = state;

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`/vehicle/vehicles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(response.data.vehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        Alert.alert("Error fetching vehicles.");
      }
    };

    fetchVehicles();
  }, [token]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateRegistrationNumber = (registrationNumber) => {
    const regNumPattern =
      /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/;
    return regNumPattern.test(registrationNumber);
  };

  const validateForm = () => {
    const {
      registrationNumber,
      ownerName,
      model,
      registrationDate,
      state,
      color,
      engineNumber,
    } = formData;

    if (!validateRegistrationNumber(registrationNumber)) {
      Alert.alert("Invalid registration number format.");
      return false;
    }

    if (
      !ownerName ||
      !model ||
      !registrationDate ||
      !state ||
      !color ||
      !engineNumber
    ) {
      Alert.alert("All fields are required.");
      return false;
    }
    return true;
  };

  const handleAddVehicle = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "/vehicle/addvehicle",
        {
          ...formData,
          userId: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert(response.data.message);
      clearForm();
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert(error.response.data.message || "Error adding vehicle.");
      } else {
        Alert.alert("Error adding vehicle.");
      }
    }
  };

  const clearForm = () => {
    setFormData({
      registrationNumber: "",
      ownerName: "",
      model: "",
      registrationDate: new Date(),
      state: "",
      vehicleType: "two-wheeler",
      color: "",
      engineNumber: "",
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, registrationDate: selectedDate });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.title}>My Vehicle Details</Text>
        <ScrollView style={styles.scrollContainer}>
          {vehicles.length === 0 ? (
            <Text>No vehicles registered. Add your vehicle below.</Text>
          ) : (
            vehicles.map((vehicle, index) => (
              <View key={index} style={styles.vehicleCard}>
                <Text style={styles.vehicleText}>
                  Registration Number: {vehicle.registrationNumber}
                </Text>
                <Text style={styles.vehicleText}>
                  Owner Full Name: {vehicle.ownerName}
                </Text>
                <Text style={styles.vehicleText}>Model: {vehicle.model}</Text>
                <Text style={styles.vehicleText}>State: {vehicle.state}</Text>
                <Text style={styles.vehicleText}>
                  Vehicle Type: {vehicle.vehicleType}
                </Text>
                <Text style={styles.vehicleText}>Color: {vehicle.color}</Text>
                <Text style={styles.vehicleText}>
                  Engine Number: {vehicle.engineNumber}
                </Text>
              </View>
            ))
          )}

          <Text style={styles.addVehicleTitle}>Add Another Vehicle</Text>

          <TextInput
            placeholder="Registration Number"
            value={formData.registrationNumber}
            onChangeText={(value) =>
              handleInputChange("registrationNumber", value)
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Owner Full Name"
            value={formData.ownerName}
            onChangeText={(value) => handleInputChange("ownerName", value)}
            style={styles.input}
          />
          <TextInput
            placeholder="Model"
            value={formData.model}
            onChangeText={(value) => handleInputChange("model", value)}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Text style={styles.dateButtonText}>Select Registration Date</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.registrationDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <TextInput
            style={styles.input}
            value={formData.registrationDate.toDateString()}
            editable={false}
          />

          <TextInput
            placeholder="State"
            value={formData.state}
            onChangeText={(value) => handleInputChange("state", value)}
            style={styles.input}
          />
          <Picker
            selectedValue={formData.vehicleType}
            style={styles.picker}
            onValueChange={(itemValue) =>
              handleInputChange("vehicleType", itemValue)
            }
          >
            <Picker.Item label="Two-wheeler" value="two-wheeler" />
            <Picker.Item label="Three-wheeler" value="three-wheeler" />
            <Picker.Item label="Four-wheeler" value="four-wheeler" />
          </Picker>
          <TextInput
            placeholder="Color"
            value={formData.color}
            onChangeText={(value) => handleInputChange("color", value)}
            style={styles.input}
          />
          <TextInput
            placeholder="Engine Number"
            value={formData.engineNumber}
            onChangeText={(value) => handleInputChange("engineNumber", value)}
            style={styles.input}
          />

          <Button
            title="Add Vehicle"
            onPress={handleAddVehicle}
            color={"#096c90"}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 10,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flexGrow: 1,
    width: 300,
    marginLeft: -9,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    backgroundColor: "#6fd2f6",
    height: 100,
    padding: 10,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: -20,
    marginLeft: -20,
    width: 323,
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "95%",
    height: 650,
    padding: 20,
    alignSelf: "center",
  },
  vehicleCard: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 4,
    backgroundColor: "#f9f9f9",
  },
  vehicleText: {
    fontSize: 16,
    marginBottom: 4,
  },
  addVehicleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    borderRadius: 4,
    borderColor: "#ddd",
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  picker: {
    borderWidth: 1,
    padding: 10,
    borderColor: "#ddd",
  },
  dateButton: {
    backgroundColor: "#096c90",
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  dateButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#096c90",
    padding: 12,
    borderRadius: 4,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default MyVehicleDetails;
