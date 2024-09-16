import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../Context/AuthContext";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FooterMenu from "../../Components/Menus/FooterMenu";

const ProfileScreen = () => {
  const [state, setState] = useContext(AuthContext);

  const handleLogout = async () => {
    setState({ token: "", user: null });
    await AsyncStorage.removeItem("@auth");
    Alert.alert("Logout", "Logout Successfully");
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://example.com/user-profile.jpg" }}
        style={styles.profilePic}
      />
      <Text style={styles.userName}>John Doe</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <FontAwesome5
          name="sign-out-alt"
          color={"red"}
          style={styles.iconStyle}
        />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
  profilePic: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  userName: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  logoutButton: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  iconStyle: { fontSize: 25, marginRight: 10 },
  logoutText: { fontSize: 18, color: "red" },
});

export default ProfileScreen;
