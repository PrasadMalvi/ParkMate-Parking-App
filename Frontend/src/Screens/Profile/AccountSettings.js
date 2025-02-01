import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { AuthContext } from "../../Context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useNavigation } from "@react-navigation/native";

const AccountSettings = () => {
  const { token } = useContext(AuthContext)[0]; // Access the context
  const [loading, setLoading] = useState(false);
  const [isContactUsOpen, setContactUsOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigation = useNavigation();

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            setLoading(true);
            try {
              const response = await fetch(
                "http://192.168.0.101:5050/auth/delete-account",
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const data = await response.json();
              setLoading(false);
              if (data.success) {
                await AsyncStorage.removeItem("@auth");
                navigation.navigate("Login");
              } else {
                Alert.alert(
                  "Error",
                  data.message || "Failed to delete account."
                );
              }
            } catch (error) {
              setLoading(false);
              console.error("Delete account error:", error);
              Alert.alert(
                "Error",
                "Something went wrong while deleting your account."
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const toggleDropdown = (dropdown) => {
    if (dropdown === "contactUs") {
      setContactUsOpen(!isContactUsOpen);
      setHelpOpen(false);
    } else if (dropdown === "help") {
      setHelpOpen(!isHelpOpen);
      setContactUsOpen(false);
    }
  };

  const handleSendMessage = () => {
    if (!name || !email || !message) {
      Alert.alert("All fields are required.");
      return;
    }

    // Here you can add functionality to send the message, e.g., API call
    Alert.alert("Message sent!", "Thank you for reaching out.");

    // Clear the form
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileCard}>
          <Text style={styles.title}>Account Settings</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#6fd2f6" />
          ) : (
            <>
              {/* Delete Account Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.buttonText}>Delete Account</Text>
              </TouchableOpacity>

              {/* Contact Us Dropdown */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => toggleDropdown("contactUs")}
              >
                <Text style={styles.buttonText}>Contact Us</Text>
              </TouchableOpacity>
              {isContactUsOpen && (
                <View style={styles.dropdownContent}>
                  <View style={styles.contactItem}>
                    <MaterialIcons name="phone" size={24} color="#096c90" />
                    <Text style={styles.contactText}>7996592596</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <MaterialIcons name="email" size={24} color="#096c90" />
                    <Text style={styles.contactText}>
                      help.parkmate@parkmate.in
                    </Text>
                  </View>
                  <View style={styles.contactItem}>
                    <MaterialIcons
                      name="location-on"
                      size={24}
                      color="#096c90"
                    />
                    <Text style={styles.contactText}>
                      Electronic City, Bangalore
                    </Text>
                  </View>
                </View>
              )}

              {/* Help Dropdown */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => toggleDropdown("help")}
              >
                <Text style={styles.buttonText}>Help</Text>
              </TouchableOpacity>
              {isHelpOpen && (
                <View style={styles.dropdownContent}>
                  <TextInput
                    style={styles.input}
                    placeholder="Your Name"
                    value={name}
                    onChangeText={setName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Your Email"
                    value={email}
                    onChangeText={setEmail}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Message"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={4}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSendMessage}
                  >
                    <Text style={styles.buttonText}>Send</Text>
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
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
  button: {
    backgroundColor: "#096c90",
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
    width: "100%",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
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
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  dropdown: {
    padding: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 18,
    color: "#333",
  },
  dropdownContent: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
});

export default AccountSettings;
