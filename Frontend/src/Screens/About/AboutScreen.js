import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://example.com/logo.png" }}
        style={styles.logo}
      />
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.description}>
        Welcome to our Parking App, your ultimate solution for finding and
        booking parking spots with ease. We are committed to making your parking
        experience as seamless and convenient as possible. With a user-friendly
        interface and real-time updates, our app ensures that you never have to
        worry about parking again.
      </Text>
      <Text style={styles.mission}>
        Our Mission: To provide a hassle-free and reliable parking solution for
        everyone, everywhere.
      </Text>
      <Text style={styles.contact}>Contact Us: support@example.com</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  logo: { width: 100, height: 100, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  description: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  mission: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  contact: { fontSize: 16, textAlign: "center", color: "blue" },
});

export default AboutScreen;
