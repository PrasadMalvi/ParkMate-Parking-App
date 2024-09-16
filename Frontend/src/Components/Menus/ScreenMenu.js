import { View, Text } from "react-native";
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "../../Screens/Auth/SignUp";
import SignIn from "../../Screens/Auth/SignIn";
import HomeScreen from "../../Screens/Home/HomeScreen";
import ParkingLocationScreen from "../../Screens/Parking/ParkingLocationScreen";
import ParkingHistory from "../../Screens/Parking/ParkingHistory";
import MallParkingScreen from "../../Screens/MallParking/MallParkingScreen";
import FastTag from "../../Screens/FastTag/FastTagScreen";
import BookingScreen from "../../Screens/Booking/BookingScreen";
import { AuthContext } from "../../Context/AuthContext";
import HeaderMenu from "./HeaderMenu";
import WalletScreen from "../../Screens/Payment/WalletScreen";
import PaymentHistory from "../../Screens/Payment/PaymentHistory";
import HelpAndSupport from "../../Screens/Help&Support/HelpAndSupport";
import ProfileScreen from "../../Screens/Profile/ProfileScreen";
import PaymentScreen from "../../Screens/Payment/PaymentScreen";

const ScreenMenu = () => {
  const [state] = useContext(AuthContext);
  //Auth Condition True False
  const authenticateUser = state?.user && state?.token;
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="SignIn">
      {authenticateUser ? (
        <>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              title: "ParkMate",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="ParkingLocationScreen"
            component={ParkingLocationScreen}
            options={{
              title: "ParkMate",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="BookingScreen"
            component={BookingScreen}
            options={{
              title: "ParkMate",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="MallParkingScreen"
            component={MallParkingScreen}
            options={{
              title: "ParkMate",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="FastTag"
            component={FastTag}
            options={{
              title: "ParkMate",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="WalletScreen"
            component={WalletScreen}
            options={{
              title: "ParkMate",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="ParkingHistory"
            component={ParkingHistory}
            options={{
              title: "ParkMate",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="PaymentHistory"
            component={PaymentHistory}
            options={{
              title: "ParkMate",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="HelpAndSupport"
            component={HelpAndSupport}
            options={{
              title: "ParkMate",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{
              title: "ParkMate",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="PaymentScreen"
            component={PaymentScreen}
            options={{
              title: "ParkMate",
              headerRight: () => <HeaderMenu />,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default ScreenMenu;
