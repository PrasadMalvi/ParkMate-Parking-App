import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import InputBox from "../../Components/Forms/InputBox";
import SubmitButton from "../../Components/Forms/SubmitButton";
import axios from "axios";

const AdminRegister = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminType, setAdminType] = useState("AdvanceBook");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!name || !email || !password || !adminType) {
        Alert.alert("Please enter all fields");
        setLoading(false);
        return;
      }

      if (!validateEmail(email)) {
        Alert.alert("Please enter a valid email (gmail.com or yahoo.com)");
        setLoading(false);
        return;
      }

      if (!validatePassword(password)) {
        Alert.alert(
          "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
        setLoading(false);
        return;
      }

      const { data } = await axios.post("/admin/adminregister", {
        name,
        email,
        password,
        adminType,
      });
      Alert.alert(data && data.message);
      navigation.navigate("AdminLogin");
      console.log("Admin Registered ==>", { name, email, password, adminType });
    } catch (error) {
      Alert.alert(error.response?.data?.message || "Registration failed");
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../../assets/Logo.png")} />
      <Text style={styles.pageTitle}>Admin SignUp</Text>
      <View style={{ marginHorizontal: 20 }}>
        <InputBox inputTitle={"  Full Name"} value={name} setValue={setName} />
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

        {/* Admin Type Picker */}
        <Text style={styles.label}>Admin Type</Text>
        <Picker
          selectedValue={adminType}
          style={styles.picker}
          onValueChange={(itemValue) => setAdminType(itemValue)}
        >
          <Picker.Item label="AdvanceBook" value="AdvanceBook" />
          <Picker.Item label="MallPark" value="MallPark" />
          <Picker.Item label="FastTag" value="FastTag" />
        </Picker>
      </View>
      <SubmitButton
        btnTitle="Register"
        loading={loading}
        handleSubmit={handleSubmit}
      />
      <Text style={styles.loginText}>
        Already Registered!{" "}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate("AdminLogin")}
        >
          Login
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
    color: "#2C3E50",
    marginBottom: 20,
    marginTop: -100,
  },
  logo: {
    height: 400,
    width: 400,
    alignContent: "center",
    justifyContent: "center",
    marginTop: -100,
    marginRight: 50,
    marginLeft: 10,
  },
  loginText: {
    textAlign: "center",
  },
  loginLink: {
    color: "#096c90",
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
    color: "#2C3E50",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default AdminRegister;
