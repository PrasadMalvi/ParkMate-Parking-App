// src/Screens/Auth/AdminLogin.js
import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import InputBox from "../../Components/Forms/InputBox";
import SubmitButton from "../../Components/Forms/SubmitButton";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../Context/AuthContext";

const AdminLogin = ({ navigation }) => {
  const { state, setState } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!email || !password) {
        Alert.alert("Please enter all fields");
        setLoading(false);
        return;
      }

      const { data } = await axios.post("/admin/adminlogin", {
        email,
        password,
      });

      const { token, user, adminType, message } = data;

      // Store token, user, and adminType in AsyncStorage
      await AsyncStorage.setItem(
        "@auth",
        JSON.stringify({ token, user, adminType }) // Ensure adminType is included
      );

      // Update state in AuthContext
      setState({ token, user, adminType }); // Include adminType here

      setLoading(false);
      // Navigate user to the correct dashboard based on adminType
      switch (adminType) {
        case "AdvanceBook":
          navigation.navigate("AdvanceBookingDashboard");
          break;
        case "MallPark":
          navigation.navigate("MallParkingDashboard");
          break;
        case "FastTag":
          navigation.navigate("FastTagDashboard");
          break;
        default:
          navigation.navigate("AdminLogin");
      }

      alert(message); // Show login success message
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../../assets/Logo.png")} />
      <Text style={styles.pageTitle}>Admin Login</Text>
      <View style={{ marginHorizontal: 20, padding: 10 }}>
        <InputBox
          inputTitle={"  E-Mail"}
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          setValue={setEmail}
        />
        <InputBox
          inputTitle={"  Password"}
          autoComplete="password"
          secureTextEntry={true}
          value={password}
          setValue={setPassword}
        />
      </View>
      <SubmitButton
        btnTitle="Login"
        loading={loading}
        handleSubmit={handleSubmit}
      />
      <Text style={styles.loginText}>
        New Admin?{" "}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate("AdminRegister")}
        >
          Register
        </Text>{" "}
        here
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#6fd2f6",
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#096c90",
    marginBottom: 20,
    marginTop: -100,
  },
  logo: {
    height: 400,
    width: 400,
    alignContent: "center",
    justifyContent: "center",
    marginTop: -100,
    marginRight: 80,
    marginLeft: 10,
  },
  loginText: {
    textAlign: "center",
  },
  loginLink: {
    color: "#096c90",
  },
});

export default AdminLogin;
