import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/Ionicons"; // Importing icon library

const HeaderMenu = () => {
  const navigation = useNavigation(); // Get the navigation object

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        style={styles.headerLogo}
        source={require("../../../assets/HLogo.png")}
      />

      {/* Icons Container */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProfileScreen")}
          style={styles.profileIcon}
        >
          <Icon name="person-circle-outline" size={43} color="#1b262f" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center", // Vertically centers the items
    justifyContent: "space-between", // Aligns logo to the left and icons to the right
    paddingVertical: 5, // Adds vertical padding
    paddingHorizontal: 10, // Adds horizontal padding to the entire header
    backgroundColor: "#096c90", // Header background color
    marginLeft: -20,
    marginTop: -20,
    width: 360,
    marginBottom: 25,
    height: 70,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  iconsContainer: {
    flexDirection: "row", // Aligns icons horizontally
    alignItems: "center", // Centers icons vertically within their container
    marginTop: 20,
  },
  iconStyle: {
    fontSize: 25, // Size of the icons
    marginHorizontal: 8, // Space between the icons
    color: "#1b262f",
    marginTop: 10,
  },
  iconStyle1: {
    fontSize: 23, // Size of the icons
    marginHorizontal: 8, // Space between the icons
    color: "#1b262f",
    marginTop: 5,
  },
  headerLogo: {
    height: 120, // Adjusted height of the logo
    width: 150, // Adjusted width of the logo
    resizeMode: "contain", // Keeps the image aspect ratio
    marginTop: 30,
    marginLeft: -15,
  },
});

export default HeaderMenu;
