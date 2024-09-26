import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import upload_area from "../../../assets/user.png";
import FooterMenu from "../../Components/Menus/FooterMenu";
import { AuthContext } from "../../Context/AuthContext";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {}, [user]);

  const handleUpdateProfile = () => {
    navigation.navigate("EditProfile", { user });
  };

  const handleMyReviews = () => {
    navigation.navigate("MyReviews");
  };

  const handleAccountSettings = () => {
    navigation.navigate("AccountSettings");
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append("profilePicture", {
      uri,
      type: "image/jpeg",
      name: "profile.jpg",
    });

    try {
      setLoading(true);
      const response = await axios.post(`/auth/upload-profile-pic`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedProfilePicture = response.data.image_url;
      await updateUserProfile(updatedProfilePicture);
      Alert.alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profilePicture) => {
    try {
      const updatedData = {
        name: user.name,
        email: user.email,
        address: user.address,
        profilePicture: String(profilePicture), // Ensure it's a string
      };

      const response = await axios.post("/auth/updateprofile", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setUser(response.data.user);
        Alert.alert("Profile updated successfully!");
      } else {
        Alert.alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("An error occurred while updating the profile.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <View style={styles.profileCard}>
        {loading ? (
          <ActivityIndicator size="large" color="#6fd2f6" />
        ) : (
          <>
            {user && user.name ? (
              <Image
                style={styles.profilePicture}
                source={{
                  uri: user?.profilePicture ? user.profilePicture : upload_area,
                }}
                onError={(e) =>
                  console.log("Error loading image:", e.nativeEvent.error)
                }
              />
            ) : (
              <Image style={styles.profilePicture} source={upload_area} />
            )}
            {user && user.name ? (
              <>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
              </>
            ) : (
              <Text>No user data available</Text>
            )}
            <View style={styles.buttonContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: 2,
                    width: "50%",
                    backgroundColor: "black",
                  }}
                />
              </View>
              <TouchableOpacity style={styles.imgUploadBtn} onPress={pickImage}>
                <Text style={styles.buttonText}>Upload Picture</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.buttonText}>Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleMyReviews}>
                <Text style={styles.buttonText}>My Reviews</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleAccountSettings}
              >
                <Text style={styles.buttonText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingLeft: 20,
  },
  header: {
    height: 300,
    backgroundColor: "#6fd2f6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerText: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
    marginTop: -90,
    marginRight: 230,
  },
  profileCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 20,
    marginTop: -80,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "95%",
  },
  profilePicture: {
    width: 190,
    height: 190,
    borderRadius: 100,
    backgroundColor: "#096c90",
    borderWidth: 2,
    marginBottom: 20,
    marginTop: -120,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#888",
    marginBottom: -50,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 80,
  },
  button: {
    backgroundColor: "#6fd2f6",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    width: "80%",
    alignItems: "center",
    width: 300,
    height: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  imgUploadBtn: {
    backgroundColor: "#6fd2f6",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    width: "80%",
    alignItems: "center",
    width: 300,
    height: 50,
  },
});

export default ProfileScreen;
