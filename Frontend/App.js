import Register from "./src/Screens/Auth/Register";
import Login from "./src/Screens/Auth/Login";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/Screens/Home/HomeScreen";
import { AuthProvider } from "./src/Context/AuthContext";
import ParkingLocationScreen from "./src/Screens/Parking/ParkingLocationScreen";
import ParkingHistory from "./src/Screens/Parking/ParkingHistory";
import BookingScreen from "./src/Screens/Booking/BookingScreen";
import MallParkingScreen from "./src/Screens/MallParking/MallParkingScreen";
import FastTag from "./src/Screens/FastTag/FastTagScreen";
import WalletScreen from "./src/Screens/Payment/WalletScreen";
import PaymentHistory from "./src/Screens/Payment/PaymentHistory";
import PaymentScreen from "./src/Screens/Payment/PaymentScreen";
import HelpAndSupport from "./src/Screens/Help&Support/HelpAndSupport";
import ProfileScreen from "./src/Screens/Profile/ProfileScreen";
import HeaderMenu from "./src/Components/Menus/HeaderMenu";
import ParkedLocation from "./src/Screens/Parking/ParkedLocation";
import ConfirmBookingScreen from "./src/Screens/Booking/ConfirmBookingScreen";
import AdvanceBookingHistory from "./src/Screens/Booking/AdvanceBookingHistory";
import SpotLocation from "./src/Screens/Booking/SpotLocation";
import EditProfile from "./src/Screens/Profile/EditProfile";
import MyReviews from "./src/Screens/Profile/MyReviews";
import AccountSettings from "./src/Screens/Profile/AccountSettings";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{
              title: "My Details",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />
          <Stack.Screen
            name="MyReviews"
            component={MyReviews}
            options={{
              title: "My Reviews",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />
          <Stack.Screen
            name="AccountSettings"
            component={AccountSettings}
            options={{
              title: "Settings",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerShown: false,
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="ParkingLocationScreen"
            component={ParkingLocationScreen}
            options={{
              title: "Park My Vehicle",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />
          <Stack.Screen
            name="ParkedLocation"
            component={ParkedLocation}
            options={{
              title: "Parked Location",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />
          <Stack.Screen
            name="BookingScreen"
            component={BookingScreen}
            options={{
              title: "Advance Booking",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />
          <Stack.Screen
            name="MallParkingScreen"
            component={MallParkingScreen}
            options={{
              title: "Mall Parking",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />
          <Stack.Screen
            name="FastTag"
            component={FastTag}
            options={{
              title: "Fast Tag",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />
          <Stack.Screen
            name="WalletScreen"
            component={WalletScreen}
            options={{
              title: "My Wallet",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />
          <Stack.Screen
            name="ParkingHistory"
            component={ParkingHistory}
            options={{
              title: "My Parking History",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
                borderBottomWidth: 0, // Remove the bottom border
                elevation: 50, // Remove the elevation (shadow) on Android
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />
          <Stack.Screen
            name="PaymentHistory"
            component={PaymentHistory}
            options={{
              title: "Payment History",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />
          <Stack.Screen
            name="HelpAndSupport"
            component={HelpAndSupport}
            options={{
              title: "Help & Support",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />

          <Stack.Screen
            name="PaymentScreen"
            component={PaymentScreen}
            options={{
              title: "Payment Screen",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />
          <Stack.Screen
            name="ConfirmBookingScreen"
            component={ConfirmBookingScreen}
            options={{
              title: "Confirm Booking",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />
          <Stack.Screen
            name="AdvanceBookingHistory"
            component={AdvanceBookingHistory}
            options={{
              title: "Advance Booking History",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />
          <Stack.Screen
            name="SpotLocation"
            component={SpotLocation}
            options={{
              title: "My Spot Location",
              headerStyle: {
                backgroundColor: "#6fd2f6",
                height: 60,
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#021218",
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
