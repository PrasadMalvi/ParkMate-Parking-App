import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../../Context/AuthContext";

const AccountSettings = () => {
  const [, , logout] = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => logout(),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View>
      {/* Add your menu items here */}
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountSettings;
