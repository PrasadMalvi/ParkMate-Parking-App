import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"; // Correct import
import { useNavigation } from "@react-navigation/native";

const FooterMenu = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
        <FontAwesome5 name="home" color={"blue"} style={styles.iconStyle} />
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
        <FontAwesome5
          name="info-circle"
          color={"blue"}
          style={styles.iconStyle}
        />
        <Text>About</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
        <FontAwesome5
          name="search-location"
          color={"blue"}
          style={styles.iconStyle}
        />
        <Text>Popular</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
        <FontAwesome5 name="user" color={"blue"} style={styles.iconStyle} />
        <Text>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
  },
  iconStyle: {
    marginBottom: 3,
    alignSelf: "center",
    fontSize: 25,
  },
});

export default FooterMenu;
