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
        <TouchableOpacity
          style={styles.moreOptionButton}
          onPress={() => navigation.navigate("ParkingHistory")}
        >
          <FontAwesome5
            name="history"
            color={"white"}
            style={styles.iconStyle1}
          />
          <Text style={styles.buttonText1}>Parking History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moreOptionButton}
          onPress={() => navigation.navigate("PaymentHistory")}
        >
          <FontAwesome5
            name="credit-card"
            color={"white"}
            style={styles.iconStyle1}
          />
          <Text style={styles.buttonText1}>Payment Methods</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moreOptionButton}
          onPress={() => navigation.navigate("AdvanceBookingHistory")}
        >
          <FontAwesome5
            name="calendar-check"
            color={"white"}
            style={styles.iconStyle1}
          />
          <Text style={styles.buttonText1}>Advance Booking History</Text>
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
    backgroundColor: "#021218",
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
    height: 100,
    width: 350,
    marginLeft: -15,
  },
  button: {
    flex: 1,
    backgroundColor: "#6fd2f6",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#096c90",
    fontSize: 16,
    marginTop: 10,
  },
  buttonText1: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
  iconStyle: {
    fontSize: 30,
    color: "#064860",
  },
  iconStyle1: {
    fontSize: 30,
    color: "white",
  },
  moreOptions: {
    marginTop: 0,
    marginBottom: 45,
  },
  moreOptionsText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  moreOptionButton: {
    backgroundColor: "#096c90",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginVertical: 5,
  },
});

export default HomeScreen;
