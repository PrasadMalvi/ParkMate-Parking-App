import { View, Text, StyleSheet, Image, Alert } from "react-native";
import React, { useContext, useState } from "react";
import InputBox from "../../Components/Forms/InputBox";
import SubmitButton from "../../Components/Forms/SubmitButton";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../Context/AuthContext";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(AuthContext);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!email || !password) {
        Alert.alert("Please enter all fields");
        setLoading(false);
        return;
      }
      setLoading(false);
      const { data } = await axios.post("/auth/login", {
        email,
        password,
      });
      setState(data);
      await AsyncStorage.setItem("@auth", JSON.stringify(data));
      alert(data && data.message);
      navigation.navigate("HomeScreen");
      console.log("Local Storage ==>", { email, password });
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
      console.log(error);
    }
  };
  /*   const getLD = async () => {
    const data = await AsyncStorage.getItem("@auth");
    console.log("LS =>", data);
  };
  getLD(); */
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../../assets/Logo.png")} />
      <Text style={styles.pageTitle}>Login</Text>
      <View style={{ marginHorizontal: 20 }}>
        <InputBox
          inputTitle={"E-Mail"}
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          setValue={setEmail}
        />
        <InputBox
          inputTitle={"Password"}
          autoComplete="password"
          secureTextEntry={true}
          value={password}
          setValue={setPassword}
        />
      </View>
      {/*<Text>{JSON.stringify({name,email,password},null,4)}</Text>*/}
      <SubmitButton
        btnTitle="Login"
        loading={loading}
        handleSubmit={handleSubmit}
      />
      <Text style={styles.loginText}>
        Already registed ?{" "}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate("Register")}
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
    backgroundColor: "#30B19B",
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2C3E50",
    marginBottom: 20,
    marginTop: -100,
  },
  inputBox: {
    height: 40,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginTop: 10,
    paddingLeft: 10,
    color: "#2C3E50",
  },
  logo: {
    height: 400,
    width: 400,
    alignContent: "center",
    justifyContent: "center",
    marginTop: -100,
    marginRight: 50,
  },
  loginText: {
    textAlign: "center",
  },
  loginLink: {
    color: "#ffffff",
  },
});

export default Login;
