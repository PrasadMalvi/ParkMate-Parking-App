import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const SubmitButton = ({ handleSubmit, btnTitle, loading }) => {
  return (
    <TouchableOpacity style={styles.SubmitBtn} onPress={handleSubmit}>
      <Text style={styles.btnText}>
        {loading ? "Please Wait........" : btnTitle}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  SubmitBtn: {
    backgroundColor: "#1E887A",
    height: 50,
    marginHorizontal: 25,
    borderRadius: 80,
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  btnText: {
    color: "#2C3E50",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "500",
  },
});

export default SubmitButton;
