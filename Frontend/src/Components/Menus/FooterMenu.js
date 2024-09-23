import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"; // Correct import
import { useNavigation } from "@react-navigation/native";

const FooterMenu = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
        <FontAwesome5 name="home" color={"#064860"} style={styles.iconStyle} />
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
        <FontAwesome5
          name="info-circle"
          color={"#064860"}
          style={styles.iconStyle}
        />
        <Text style={styles.buttonText}>About</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
        <FontAwesome5
          name="search-location"
          color={"#064860"}
          style={styles.iconStyle}
        />
        <Text style={styles.buttonText}>Popular</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
        <FontAwesome5 name="user" color={"#064860"} style={styles.iconStyle} />
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: -20,
    backgroundColor: "#3FC3E5",
    width: 360,
    height: 70,
  },
  iconStyle: {
    marginBottom: 3,
    alignSelf: "center",
    fontSize: 25,
    marginTop: 15,
  },
  buttonText: {
    textAlign: "center",
    color: "#064860",
  },
});

export default FooterMenu;
