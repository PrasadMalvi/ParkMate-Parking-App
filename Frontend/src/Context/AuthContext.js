import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Create the AuthContext
const AuthContext = createContext();

// Define the AuthProvider component
const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    token: "",
  });

  // Set default Axios settings
  axios.defaults.baseURL = "http://192.168.0.102:5050";

  // Load local storage data on initial render
  useEffect(() => {
    const loadLocalStorageData = async () => {
      const data = await AsyncStorage.getItem("@auth");
      const parsedData = JSON.parse(data);

      if (parsedData) {
        setState({
          user: parsedData.user,
          token: parsedData.token,
        });
      }
    };
    loadLocalStorageData();
  }, []);

  // Set authorization token header for Axios
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [state.token]);

  const logout = async () => {
    setState({ user: null, token: "" });
    await AsyncStorage.removeItem("@auth");
  };

  return (
    <AuthContext.Provider value={[state, setState, logout]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
