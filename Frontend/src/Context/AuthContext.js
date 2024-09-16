import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Create the AuthContext
const AuthContext = createContext();

// Define the AuthProvider component
const AuthProvider = ({ children }) => {
  // Global state for user authentication
  const [state, setState] = useState({
    user: null,
    token: "",
  });

  // Set default Axios settings
  axios.defaults.baseURL = "http://192.168.0.101:5050";

  // Set the authorization token header if a token exists
  if (state.token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
  }

  // Initialize state from AsyncStorage
  useEffect(() => {
    const loadLocalStorageData = async () => {
      try {
        const data = await AsyncStorage.getItem("@auth");
        const parsedData = JSON.parse(data);
        if (parsedData) {
          setState({ user: parsedData.user, token: parsedData.token });
        }
      } catch (error) {
        console.log("Error loading data from AsyncStorage:", error);
      }
    };
    loadLocalStorageData();
  }, []);

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
