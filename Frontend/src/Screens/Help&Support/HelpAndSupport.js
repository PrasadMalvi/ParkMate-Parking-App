import { View, Text, Button, StyleSheet, Alert, Linking } from "react-native";
import React from "react";
import FooterMenu from "../../Components/Menus/FooterMenu";

const HelpAndSupport = () => {
  const handleCallSupport = () => {
    Linking.openURL("tel:+1234567890");
  };

  const handleEmailSupport = () => {
    Linking.openURL("mailto:support@example.com?subject=Help%20and%20Support");
  };

  const handleFAQ = () => {
    // Navigate to FAQ screen or open a URL
    Linking.openURL("https://example.com/faq");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>
      <Button title="Call Support" onPress={handleCallSupport} />
      <Button title="Email Support" onPress={handleEmailSupport} />
      <Button title="Visit FAQ" onPress={handleFAQ} />
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default HelpAndSupport;
