import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView, // Import ScrollView
} from "react-native";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

const EditProfile = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isBasicInfoOpen, setBasicInfoOpen] = useState(false);
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);
  const [isVehiclesOpen, setVehiclesOpen] = useState(false);

  const [state] = useContext(AuthContext);
  const { token } = state;

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/auth/getUserData`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success && response.data.user) {
          setUser(response.data.user);
          setName(response.data.user.name);
          setEmail(response.data.user.email);
          setAddress(response.data.user.address);
          setVehicles(response.data.user.vehicles || []);
        } else {
          console.error("Failed to fetch valid user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/auth/updateprofile",
        {
          name,
          email,
          address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        Alert.alert("Profile updated successfully!");
      } else {
        Alert.alert("Failed to update profile.");
      }
    } catch (error) {
      Alert.alert("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      return Alert.alert("Enter Current Password Currectly.");
    }
    if (!newPassword || newPassword !== confirmNewPassword) {
      return Alert.alert("No Mathing New Password & ConfirmPasword.");
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "/auth/updateprofile",
        {
          password: currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        Alert.alert("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        Alert.alert("Failed to change password.");
      }
    } catch (error) {
      Alert.alert("Error changing password.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEditVehicle = () => {
    navigation.navigate("MyVehicleDetails");
  };

  // Toggle dropdown and close others
  const toggleDropdown = (dropdown) => {
    if (dropdown === "basic") {
      setBasicInfoOpen(!isBasicInfoOpen);
      setPrivacyOpen(false);
      setVehiclesOpen(false);
    } else if (dropdown === "privacy") {
      setBasicInfoOpen(false);
      setPrivacyOpen(!isPrivacyOpen);
      setVehiclesOpen(false);
    } else if (dropdown === "vehicles") {
      setBasicInfoOpen(false);
      setPrivacyOpen(false);
      setVehiclesOpen(!isVehiclesOpen);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileCard}>
          <Text style={styles.title}>Edit Profile</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#6fd2f6" />
          ) : (
            <>
              {/* Basic Info Dropdown */}
              <TouchableOpacity
                onPress={() => toggleDropdown("basic")}
                style={styles.dropdown}
              >
                <Text style={styles.dropdownText}>Edit Basic Information</Text>
              </TouchableOpacity>
              {isBasicInfoOpen && (
                <View style={styles.dropdownContent}>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                  />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                  />
                  <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Address"
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSaveChanges}
                  >
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Privacy Settings Dropdown */}
              <TouchableOpacity
                onPress={() => toggleDropdown("privacy")}
                style={styles.dropdown}
              >
                <Text style={styles.dropdownText}>Privacy Settings</Text>
              </TouchableOpacity>
              {isPrivacyOpen && (
                <View style={styles.dropdownContent}>
                  <TextInput
                    style={styles.input}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Current Password"
                    secureTextEntry
                  />
                  <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="New Password"
                    secureTextEntry
                  />
                  <TextInput
                    style={styles.input}
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    placeholder="Confirm New Password"
                    secureTextEntry
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleChangePassword}
                  >
                    <Text style={styles.buttonText}>Change Password</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Vehicles Dropdown */}
              <TouchableOpacity
                onPress={() => toggleDropdown("vehicles")}
                style={styles.dropdown}
              >
                <Text style={styles.dropdownText}>Manage Vehicles</Text>
              </TouchableOpacity>
              {isVehiclesOpen && (
                <View style={styles.dropdownContent}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleAddOrEditVehicle}
                  >
                    <Text style={styles.buttonText}>My Vehicles</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#F5F5F5" },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    backgroundColor: "#6fd2f6",
    height: 100,
    marginTop: -20,
    marginLeft: -20,
    width: 320,
    paddingTop: 20,
    color: "white",
    borderRadius: 10,
  },
  dropdown: {
    padding: 15,
    backgroundColor: "#096c90",
    borderRadius: 25,
    marginBottom: 10,
    width: "100%",
  },
  dropdownText: { fontSize: 18, fontWeight: "bold", color: "white" },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 25,
    marginBottom: 10,
    width: "100%",
  },
  button: {
    backgroundColor: "#6fd2f6",
    padding: 15,
    borderRadius: 10,
    marginTop: 0,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  vehicleText: {
    marginVertical: 5,
    fontSize: 16,
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
    padding: 20, // Added padding for better spacing
    height: 650,
  },
  dropdownContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  scrollContainer: {
    paddingBottom: 20, // Extra padding at the bottom for ScrollView
  },
});

export default EditProfile;
