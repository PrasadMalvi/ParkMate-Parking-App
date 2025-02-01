// src/Context/AuthContext.js
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
  const [token, setToken] = useState(null);
  // Set default Axios settings
  axios.defaults.baseURL = "http://192.168.0.103:5050";

  // Load user data from AsyncStorage on mount
  useEffect(() => {
    const loadLocalStorageData = async () => {
      const data = await AsyncStorage.getItem("@auth");
      const parsedData = JSON.parse(data);

      // Check if data exists before setting state
      if (parsedData) {
        setState({
          user: parsedData.user,
          token: parsedData.token,
        });
      }
    };
    loadLocalStorageData();
  }, []);

  // If the token exists, set it as a default header for Axios
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [state.token]);

  const logout = async () => {
    await AsyncStorage.removeItem("@auth"); // Clear user data from AsyncStorage
    setState({ user: null, token: null }); // Reset state
  };

  return (
    <AuthContext.Provider value={{ state, setState, logout, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
