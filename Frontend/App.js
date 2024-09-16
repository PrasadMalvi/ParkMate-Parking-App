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
              title: "ParkMate",
            }}
          />
          <Stack.Screen
            name="BookingScreen"
            component={BookingScreen}
            options={{
              title: "ParkMate",
            }}
          />
          <Stack.Screen
            name="MallParkingScreen"
            component={MallParkingScreen}
            options={{
              title: "ParkMate",
            }}
          />
          <Stack.Screen
            name="FastTag"
            component={FastTag}
            options={{
              title: "ParkMate",
            }}
          />
          <Stack.Screen
            name="WalletScreen"
            component={WalletScreen}
            options={{
              title: "ParkMate",
            }}
          />
          <Stack.Screen
            name="ParkingHistory"
            component={ParkingHistory}
            options={{
              title: "ParkMate",
            }}
          />
          <Stack.Screen
            name="PaymentHistory"
            component={PaymentHistory}
            options={{
              title: "ParkMate",
            }}
          />
          <Stack.Screen
            name="HelpAndSupport"
            component={HelpAndSupport}
            options={{
              title: "ParkMate",
            }}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{
              title: "ParkMate",
            }}
          />
          <Stack.Screen
            name="PaymentScreen"
            component={PaymentScreen}
            options={{
              title: "ParkMate",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
