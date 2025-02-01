// AdminScreenMenu.js
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../../Context/AuthContext";
import AdminLogin from "../../Screens/Auth/AdminLogin";
import AdminRegister from "../../Screens/Auth/AdminRegister";
import AdvanceBookingDashboard from "../../Screens/Home/AdvanceBookingDashboard";
import MallParkingDashboard from "../../Screens/Home/MallParkingDashboard";
import FastTagDashboard from "../../Screens/Home/FastTagDashboard";
import AddMallDetails from "../../Screens/MallParking/AddMallDetails";
import EntryScanner from "../../Screens/MallParking/EntryScanner";
import ExitScanner from "../../Screens/MallParking/ExitScanner";
import ParkingHistory from "../../Screens/MallParking/ParkingHistory";
import AddParkingSpot from "../../Screens/AdvanceBooking/AddParkingSpot";
import AdvanceBookProfile from "../../Screens/AdvanceBooking/AdvanceBookProfile";
import ManageBookings from "../../Screens/AdvanceBooking/ManageBookingSpot";

const AdminScreenMenu = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName={"AdminLogin"}>
      <Stack.Screen
        name="MallParkingDashboard"
        component={MallParkingDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdvanceBookingDashboard"
        component={AdvanceBookingDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FastTagDashboard"
        component={FastTagDashboard}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AddParkingSpot"
        component={AddParkingSpot}
        options={{ title: "Add Parking Spot" }}
      />
      <Stack.Screen
        name="ManageBookings"
        component={ManageBookings}
        options={{ title: "Manage Bookings" }}
      />
      <Stack.Screen
        name="AdvanceBookProfile"
        component={AdvanceBookProfile}
        options={{ title: "AdvanceBookProfile" }}
      />
      <Stack.Screen
        name="AddMallDetails"
        component={AddMallDetails}
        options={{ title: "Add Mall Details" }}
      />
      <Stack.Screen
        name="EntryScanner"
        component={EntryScanner}
        options={{ title: "Entry Scanner" }}
      />
      <Stack.Screen
        name="ExitScanner"
        component={ExitScanner}
        options={{ title: "Exit Scanner" }}
      />
      <Stack.Screen
        name="ParkingHistory"
        component={ParkingHistory}
        options={{ title: "Parking History" }}
      />

      <Stack.Screen
        name="AdminLogin"
        component={AdminLogin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminRegister"
        component={AdminRegister}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AdminScreenMenu;
