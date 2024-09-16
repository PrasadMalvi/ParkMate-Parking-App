import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FooterMenu from "../../Components/Menus/FooterMenu";
import HeaderMenu from "../../Components/Menus/HeaderMenu";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <HeaderMenu />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ParkingLocationScreen")}
        >
          <FontAwesome5
            name="parking"
            color={"white"}
            style={styles.iconStyle}
          />
          <Text style={styles.buttonText}>Park Here</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("BookingScreen")}
        >
          <FontAwesome5
            name="calendar-plus"
            color={"white"}
            style={styles.iconStyle}
          />
          <Text style={styles.buttonText}>Advance Book</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MallParkingScreen")}
        >
          <FontAwesome5
            name="building"
            color={"white"}
            style={styles.iconStyle}
          />
          <Text style={styles.buttonText}>Mall Parking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("FastTag")}
        >
          <FontAwesome5 name="road" color={"white"} style={styles.iconStyle} />
          <Text style={styles.buttonText}>FastTag</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.moreOptions}>
        <Text style={styles.moreOptionsText}>More Options</Text>

        <TouchableOpacity
          style={styles.moreOptionButton}
          onPress={() => navigation.navigate("ParkingHistory")}
        >
          <FontAwesome5
            name="history"
            color={"white"}
            style={styles.iconStyle}
          />
          <Text style={styles.buttonText}>Parking History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moreOptionButton}
          onPress={() => navigation.navigate("PaymentHistory")}
        >
          <FontAwesome5
            name="credit-card"
            color={"white"}
            style={styles.iconStyle}
          />
          <Text style={styles.buttonText}>Payment Methods</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moreOptionButton}
          onPress={() => navigation.navigate("HelpAndSupport")}
        >
          <FontAwesome5
            name="life-ring"
            color={"white"}
            style={styles.iconStyle}
          />
          <Text style={styles.buttonText}>Help & Support</Text>
        </TouchableOpacity>
      </View>
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#007bff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
  iconStyle: {
    fontSize: 30,
  },
  moreOptions: {
    marginTop: 20,
  },
  moreOptionsText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  moreOptionButton: {
    backgroundColor: "#28a745",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginVertical: 5,
  },
});

export default HomeScreen;
